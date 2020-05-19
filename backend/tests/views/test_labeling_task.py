from unittest import mock

from rest_framework import status
from rest_framework.reverse import reverse

from model_garden.services.cvat import CVATServiceException, ListResponse
from tests import BaseAPITestCase


class TestLabelingTaskViewSet(BaseAPITestCase):
  def setUp(self):
    super().setUp()
    self.cvat_service_cls_patcher = mock.patch('model_garden.views.labeling_task.CvatService')
    self.cvat_service_cls_mock = self.cvat_service_cls_patcher.start()
    self.cvat_service_mock = self.cvat_service_cls_mock.return_value
    self.cvat_service_mock.get_root_user.return_value = {'id': 1}
    self.cvat_service_mock.get_user.return_value = {'id': 3, 'username': 'test_labeler'}
    self.cvat_service_mock.tasks.return_value = ListResponse(
      count=1,
      next_url=None,
      prev_url=None,
      results=[{
        "id": 4,
        "name": "assignment",
        "mode": "annotation",
        "assignee": None,
        "status": "annotation",
        "url": "http://localhost:8080/api/v1/tasks/4",
        "project": None,
      }],
    )

  def tearDown(self):
    self.cvat_service_cls_patcher.stop()

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
            "name": labeling_task.name,
            "dataset": f"/{dataset.path}",
            "labeler": labeling_task.labeler.username,
            "status": labeling_task.status,
          },
        ],
      },
    )

  def test_response_not_found(self):
    self.cvat_service_mock.tasks.return_value = ListResponse(
      count=0,
      next_url=None,
      prev_url=None,
      results=[],
    )

    response = self.client.get(
      path=reverse('labelingtask-list'),
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(
      response.json(),
      {
        "count": 0,
        "next": None,
        "previous": None,
        "results": [],
      },
    )
