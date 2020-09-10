from unittest import mock

from rest_framework import status
from rest_framework.reverse import reverse

from model_garden.constants import LabelingTaskStatus
from model_garden.services.cvat import CVATServiceException
from tests import BaseAPITestCase


class TestLabelingTaskViewSet(BaseAPITestCase):
  def setUp(self):
    super().setUp()
    self.cvat_service_cls_patcher = mock.patch('model_garden.views.labeling_task.CvatService')
    self.cvat_service_cls_mock = self.cvat_service_cls_patcher.start()
    self.cvat_service_mock = self.cvat_service_cls_mock.return_value
    self.cvat_service_mock.get_root_user.return_value = {'id': 1}
    self.cvat_service_mock.get_user.return_value = {'id': 3, 'username': 'test_labeler'}
    self.cvat_service_mock.create_task.return_value = {'id': 1}
    self.cvat_service_mock.get_task.return_value = {
      'id': 1,
      'status': LabelingTaskStatus.ANNOTATION,
    }

  def tearDown(self):
    self.cvat_service_cls_patcher.stop()
    super().tearDown()

  def test_create(self):
    dataset = self.test_factory.create_dataset()
    media_asset = self.test_factory.create_media_asset(dataset=dataset)
    labeler = self.test_factory.create_labeler(labeler_id=3)

    response = self.client.post(
      path=reverse('labelingtask-list'),
      data={
        'task_name': 'test',
        'dataset_id': dataset.id,
        'assignee_id': labeler.labeler_id,
        'files_in_task': 2,
        'count_of_tasks': 1,
      },
    )

    self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.content)
    self.cvat_service_mock.create_task.assert_called_once_with(
      name='test.01',
      assignee_id=3,
      owner_id=1,
      remote_files=[
        f'https://d3o54g14k1n39o.cloudfront.net/test_path/{media_asset.filename}',
      ],
    )
    media_asset.refresh_from_db()
    self.assertIsNotNone(media_asset.labeling_task)
    self.assertEqual(media_asset.labeling_task.labeler.labeler_id, labeler.labeler_id)

  def test_create_dataset_not_found(self):
    response = self.client.post(
      path=reverse('labelingtask-list'),
      data={
        'task_name': 'test',
        'dataset_id': 1,
        'assignee_id': 3,
        'files_in_task': 2,
        'count_of_tasks': 1,
      },
    )

    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertEqual(response.json(), {'message': "Dataset with id='1' not found"})

  def test_create_labeler_not_found(self):
    dataset = self.test_factory.create_dataset()
    media_asset = self.test_factory.create_media_asset(dataset=dataset)

    response = self.client.post(
      path=reverse('labelingtask-list'),
      data={
        'task_name': 'test',
        'dataset_id': dataset.id,
        'assignee_id': 3,
        'files_in_task': 2,
        'count_of_tasks': 1,
      },
    )

    self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.content)
    self.cvat_service_mock.create_task.assert_called_once_with(
      name='test.01',
      assignee_id=3,
      owner_id=1,
      remote_files=[
        f'https://d3o54g14k1n39o.cloudfront.net/test_path/{media_asset.filename}',
      ],
    )
    media_asset.refresh_from_db()
    self.assertIsNotNone(media_asset.labeling_task)
    self.assertEqual(media_asset.labeling_task.labeler.labeler_id, 3)

  def test_create_cvat_user_not_found(self):
    self.cvat_service_mock.get_user.side_effect = CVATServiceException("not found")
    dataset = self.test_factory.create_dataset()
    media_asset = self.test_factory.create_media_asset(dataset=dataset)

    response = self.client.post(
      path=reverse('labelingtask-list'),
      data={
        'task_name': 'test',
        'dataset_id': dataset.id,
        'assignee_id': 3,
        'files_in_task': 2,
        'count_of_tasks': 1,
      },
    )

    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND, response.content)
    self.assertEqual(response.json(), {'message': 'not found'})
    self.cvat_service_mock.create_task.assert_not_called()
    media_asset.refresh_from_db()
    self.assertIsNone(media_asset.labeling_task)

  def test_create_cvat_request_fails(self):
    self.cvat_service_mock.create_task.side_effect = CVATServiceException("request failed")
    dataset = self.test_factory.create_dataset()
    self.test_factory.create_media_asset(dataset=dataset)
    labeler = self.test_factory.create_labeler(labeler_id=3)

    response = self.client.post(
      path=reverse('labelingtask-list'),
      data={
        'task_name': 'test',
        'dataset_id': dataset.id,
        'assignee_id': labeler.labeler_id,
        'files_in_task': 2,
        'count_of_tasks': 1,
      },
    )

    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertEqual(response.json(), {'message': 'request failed'})

  def test_list(self):
    dataset = self.test_factory.create_dataset()
    labeling_task = self.test_factory.create_labeling_task(name='Test labeling task')
    media_asset = self.test_factory.create_media_asset(dataset=dataset)
    media_asset.labeling_task = labeling_task
    media_asset.save()

    response = self.client.get(
      path=reverse('labelingtask-list'),
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(
      response.json(),
      {
        "count": 1,
        "next": None,
        "previous": None,
        "results": [
          {
            "id": labeling_task.id,
            "name": labeling_task.name,
            "dataset_id": dataset.id,
            "dataset": dataset.path,
            "labeler": labeling_task.labeler.username,
            "url": 'http://localhost:8080/task/1',
            "status": labeling_task.status,
            "error": None,
          },
        ],
      },
    )

  def test_list_same_labeling_task_multiple_media_assets(self):
    dataset = self.test_factory.create_dataset()
    labeling_task = self.test_factory.create_labeling_task(name='Test labeling task')
    media_asset1 = self.test_factory.create_media_asset(dataset=dataset)
    media_asset1.labeling_task = labeling_task
    media_asset1.save()
    media_asset2 = self.test_factory.create_media_asset(dataset=dataset)
    media_asset2.labeling_task = labeling_task
    media_asset2.save()

    response = self.client.get(
      path=reverse('labelingtask-list'),
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.json()['count'], 1)

  def test_list_with_name_filter(self):
    t1 = self.test_factory.create_labeling_task(name='Test labeling task 1')
    self.test_factory.create_labeling_task(name='Test labeling task 2')

    response = self.client.get(
      path=reverse('labelingtask-list'),
      data={
        'name': 'Test labeling task 1',
      },
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.json()['count'], 1)
    self.assertEqual(response.json()['results'][0]['name'], t1.name)

  def test_list_with_name_filter_contains(self):
    self.test_factory.create_labeling_task(name='Test labeling task 1')
    t2 = self.test_factory.create_labeling_task(name='Test labeling task 2')

    response = self.client.get(
      path=reverse('labelingtask-list'),
      data={
        'name': 'task 2',
      },
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.json()['count'], 1)
    self.assertEqual(response.json()['results'][0]['name'], t2.name)

  def test_list_with_name_filter_empty_result(self):
    self.test_factory.create_labeling_task(name='Test labeling task 1')
    self.test_factory.create_labeling_task(name='Test labeling task 2')

    response = self.client.get(
      path=reverse('labelingtask-list'),
      data={
        'name': 'Test labeling task 3',
      },
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.json()['count'], 0)

  def test_list_with_dataset_filter(self):
    dataset1 = self.test_factory.create_dataset(path='/test_path1')
    dataset2 = self.test_factory.create_dataset(path='/test_path2')
    self.test_factory.create_media_asset(dataset=dataset1, assigned=True)
    media_asset2 = self.test_factory.create_media_asset(dataset=dataset2, assigned=True)

    response = self.client.get(
      path=reverse('labelingtask-list'),
      data={
        'dataset': dataset2.path,
      },
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.json()['count'], 1)
    self.assertEqual(response.json()['results'][0]['name'], media_asset2.labeling_task.name)

  def test_list_with_dataset_filter_empty_result(self):
    dataset1 = self.test_factory.create_dataset(path='/test_path1')
    dataset2 = self.test_factory.create_dataset(path='/test_path2')
    self.test_factory.create_media_asset(dataset=dataset1, assigned=True)
    self.test_factory.create_media_asset(dataset=dataset2, assigned=True)

    response = self.client.get(
      path=reverse('labelingtask-list'),
      data={
        'dataset': 'test_path3',
      },
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.json()['count'], 0)

  def test_list_with_labeler_filter(self):
    self.test_factory.create_labeling_task(name='Test labeling task 1')
    labeling_task2 = self.test_factory.create_labeling_task(name='Test labeling task 2')

    response = self.client.get(
      path=reverse('labelingtask-list'),
      data={
        'labeler': labeling_task2.labeler.username,
      },
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.json()['count'], 1)
    self.assertEqual(response.json()['results'][0]['name'], labeling_task2.name)

  def test_list_with_labeler_filter_empty_result(self):
    self.test_factory.create_labeling_task(name='Test labeling task 1')
    self.test_factory.create_labeling_task(name='Test labeling task 2')

    response = self.client.get(
      path=reverse('labelingtask-list'),
      data={
        'labeler': 'unknown labeler',
      },
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.json()['count'], 0)

  def test_list_with_status_filter(self):
    self.test_factory.create_labeling_task(name='Test labeling task 1', status=LabelingTaskStatus.ANNOTATION)
    t2 = self.test_factory.create_labeling_task(name='Test labeling task 2', status=LabelingTaskStatus.VALIDATION)
    self.test_factory.create_labeling_task(name='Test labeling task 3', status=LabelingTaskStatus.COMPLETED)

    response = self.client.get(
      path=reverse('labelingtask-list'),
      data={
        'status': LabelingTaskStatus.VALIDATION,
      },
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.json()['count'], 1)
    self.assertEqual(response.json()['results'][0]['name'], t2.name)

  def test_list_with_multiple_status_filters(self):
    self.test_factory.create_labeling_task(name='Test labeling task 1', status=LabelingTaskStatus.ANNOTATION)
    t2 = self.test_factory.create_labeling_task(name='Test labeling task 2', status=LabelingTaskStatus.VALIDATION)
    t3 = self.test_factory.create_labeling_task(name='Test labeling task 3', status=LabelingTaskStatus.COMPLETED)

    response = self.client.get(
      path=reverse('labelingtask-list'),
      data={
        'status': [LabelingTaskStatus.VALIDATION, LabelingTaskStatus.COMPLETED],
      },
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.json()['count'], 2)
    self.assertEqual({t['name'] for t in response.json()['results']}, {t2.name, t3.name})

  def test_list_with_status_filter_empty_result(self):
    self.test_factory.create_labeling_task(name='Test labeling task 1', status=LabelingTaskStatus.ANNOTATION)
    self.test_factory.create_labeling_task(name='Test labeling task 3', status=LabelingTaskStatus.COMPLETED)

    response = self.client.get(
      path=reverse('labelingtask-list'),
      data={
        'status': LabelingTaskStatus.VALIDATION,
      },
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.json()['count'], 0)

  def test_list_with_dataset_id_filter(self):
    dataset = self.test_factory.create_dataset()
    task1 = self.test_factory.create_labeling_task(name='Test labeling task1')
    task2 = self.test_factory.create_labeling_task(name='Test labeling task2')
    media1 = self.test_factory.create_media_asset(dataset=dataset)
    media1.labeling_task = task1
    media1.save()
    media2 = self.test_factory.create_media_asset(dataset=dataset)
    media2.labeling_task = task2
    media2.save()

    response = self.client.get(
      path=reverse('labelingtask-list'),
      data={
        'dataset_id': dataset.id,
      },
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.json()['count'], 2)
    self.assertEqual({task['name'] for task in response.json()['results']}, {task1.name, task2.name})

  def test_list_with_dataset_id_filter_empty_result(self):
    response = self.client.get(
      path=reverse('labelingtask-list'),
      data={
        'dataset_id': 0,
      },
    )

    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

  def test_ordering_by_labeler_name(self):
    task = self.test_factory.create_labeling_task(name='task 1')
    task.labeler.username = 'zyx'
    task.labeler.save()

    task = self.test_factory.create_labeling_task(name='task 2')
    task.labeler.username = 'abc'
    task.labeler.save()

    response = self.client.get(
      path=reverse('labelingtask-list'),
      data={
        'ordering': '-labeler',
      },
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.json()['results'][0]['labeler'], 'zyx')
    self.assertEqual(response.json()['results'][1]['labeler'], 'abc')

  def test_ordering_by_name(self):
    self.test_factory.create_labeling_task(name='task 1')
    self.test_factory.create_labeling_task(name='task 2')

    response = self.client.get(
      path=reverse('labelingtask-list'),
      data={
        'ordering': '-name',
      },
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.json()['results'][0]['name'], 'task 2')
    self.assertEqual(response.json()['results'][1]['name'], 'task 1')

  def test_archive_without_task_id(self):
    response = self.client.patch(
      path=reverse('labelingtask-archive'),
      data={},
    )

    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertEqual(response.json(), {'id': ['This field is required.']})

  def test_archive_several_tasks(self):
    self.cvat_service_mock.delete_task.return_value = None

    tasks = [
      self.test_factory.create_labeling_task(status=LabelingTaskStatus.ANNOTATION),
      self.test_factory.create_labeling_task(status=LabelingTaskStatus.COMPLETED),
    ]
    archived_ids = [t.id for t in tasks]

    response = self.client.patch(
      path=reverse('labelingtask-archive'),
      data={'id': archived_ids},
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertSetEqual(set(response.json()['archived']), set(archived_ids))
    self.assertListEqual(response.json()['errors'], [])

    self.assertEqual(self.cvat_service_mock.delete_task.call_count, 2)

  def test_archive_save_deleted_task(self):
    self.cvat_service_mock.delete_task.return_value = CVATServiceException()

    tasks = [
      self.test_factory.create_labeling_task(status=LabelingTaskStatus.SAVED),
    ]
    archived_ids = [t.id for t in tasks]

    response = self.client.patch(
      path=reverse('labelingtask-archive'),
      data={'id': archived_ids},
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertSetEqual(set(response.json()['archived']), set(archived_ids))
    self.assertListEqual(response.json()['errors'], [])

    self.assertEqual(self.cvat_service_mock.delete_task.call_count, 1)

  def test_archive_skips_already_archived_tasks(self):
    self.cvat_service_mock.delete_task.return_value = None

    tasks = [
      self.test_factory.create_labeling_task(status=LabelingTaskStatus.ARCHIVED),
      self.test_factory.create_labeling_task(status=LabelingTaskStatus.COMPLETED),
    ]
    archived_ids = [t.id for t in tasks]

    response = self.client.patch(
      path=reverse('labelingtask-archive'),
      data={'id': archived_ids},
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertSetEqual(set(response.json()['archived']), set([archived_ids[1]]))
    self.assertListEqual(response.json()['errors'], [])

    self.assertEqual(self.cvat_service_mock.delete_task.call_count, 1)

  def test_archive_sends_error_on_failed_cvat_calls(self):
    self.cvat_service_mock.delete_task.side_effect = [
      None,
      CVATServiceException(),
    ]

    tasks = [
      self.test_factory.create_labeling_task(status=LabelingTaskStatus.ANNOTATION),
      self.test_factory.create_labeling_task(status=LabelingTaskStatus.COMPLETED),
    ]
    archived_ids = [t.id for t in tasks]
    expected = archived_ids[:]

    response = self.client.patch(
      path=reverse('labelingtask-archive'),
      data={'id': archived_ids},
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)

    got_archived = response.json()['archived']
    self.assertEqual(len(got_archived), 1)
    self.assertIn(got_archived[0], expected)
    expected.remove(got_archived[0])

    got_errors = response.json()['errors']
    self.assertEqual(len(got_errors), 1)
    self.assertIn(got_errors[0]['id'], expected)

    self.assertEqual(self.cvat_service_mock.delete_task.call_count, 2)

  def test_retry(self):
    labeling_task1 = self.test_factory.create_labeling_task(error='error 1')
    labeling_task2 = self.test_factory.create_labeling_task(error='error 2')

    response = self.client.patch(
      path=reverse('labelingtask-retry'),
      data={'id': [labeling_task2.pk]},
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    labeling_task1.refresh_from_db()
    labeling_task2.refresh_from_db()
    self.assertEqual(labeling_task1.error, 'error 1')
    self.assertIsNone(labeling_task2.error)

  def test_retry_not_found(self):
    labeling_task = self.test_factory.create_labeling_task(error='some error')

    response = self.client.patch(
      path=reverse('labelingtask-retry'),
      data={'id': [777]},
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    labeling_task.refresh_from_db()
    self.assertEqual(labeling_task.error, 'some error')
