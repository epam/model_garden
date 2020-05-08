from unittest import mock

from rest_framework.reverse import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.exceptions import ValidationError

from model_garden.views.cvat_tasks import CvatTasksQuerySet
from model_garden.services.cvat import CVATServiceException, ListResponse
from tests import BaseAPITestCase


class TestCvatTaskViewSet(BaseAPITestCase):
  def setUp(self):
    super().setUp()
    self.cvat_service_cls_patcher = mock.patch('model_garden.views.cvat_tasks.CvatService')
    self.cvat_service_cls_mock = self.cvat_service_cls_patcher.start()
    self.cvat_service_mock = self.cvat_service_cls_mock.return_value
    self.cvat_service_mock.get_root_user.return_value = {'id': 1}
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
        "project": None
      }]
    )

  def tearDown(self):
    self.cvat_service_cls_patcher.stop()

  def test_create(self):
    dataset = self.test_factory.create_dataset()
    self.test_factory.create_media_asset(dataset=dataset)

    response = self.client.post(
      path=reverse('cvattasks-list'),
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
      name='test',
      assignee_id=3,
      owner_id=1,
      remote_files=[
        'https://d3o54g14k1n39o.cloudfront.net/test_path/image.jpg',
      ],
    )

  def test_create_dataset_not_found(self):
    response = self.client.post(
      path=reverse('cvattasks-list'),
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

  def test_create_cvat_request_fails(self):
    self.cvat_service_mock.create_task.side_effect = CVATServiceException("request failed")
    dataset = self.test_factory.create_dataset()
    self.test_factory.create_media_asset(dataset=dataset)

    response = self.client.post(
      path=reverse('cvattasks-list'),
      data={
        'task_name': 'test',
        'dataset_id': dataset.id,
        'assignee_id': 3,
        'files_in_task': 2,
        'count_of_tasks': 1,
      },
    )

    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertEqual(response.json(), {'message': 'request failed'})

  def test_list(self):
    response = self.client.get(
      path=reverse('cvattasks-list'),
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(
      response.json(),
      {
          "count": 1,
          "next": None,
          "previous": None,
          "results": [{
            "id": 4,
            "name": "assignment",
            "mode": "annotation",
            "assignee": None,
            "status": "annotation",
            "url": "http://localhost:8080/api/v1/tasks/4",
            "project": None
          }]
      }
    )

  def test_response_not_found(self):
    self.cvat_service_mock.tasks.return_value = ListResponse(
      count=0,
      next_url=None,
      prev_url=None,
      results=[]
    )

    response = self.client.get(
      path=reverse('cvattasks-list'),
    )
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TestCvatTasksQuerySet(APITestCase):
  def setUp(self):
    self.cvat = mock.MagicMock()
    self.queryset = CvatTasksQuerySet(self.cvat)

  def test_filter(self):
    self.queryset.filter(id=1, name='foo').filter(status='completed')

    self.assertDictEqual(
      self.queryset.service_request.filters,
      {'id': 1, 'name': 'foo', 'status': 'completed'}
    )

  def test_filter_strips_empty_values(self):
    self.queryset.filter(id=None, name='foo')

    self.assertDictEqual(
      self.queryset.service_request.filters,
      {'name': 'foo'}
    )

  def test_filter_wrong_value(self):
    with self.assertRaises(ValidationError):
      self.queryset.filter(status='???')

  def test_order_by(self):
    self.queryset.order_by('-name')

    self.assertEqual(self.queryset.service_request.ordering, '-name')

  def test_len(self):
    self.cvat.tasks.return_value = ListResponse(
      count=123,
      next_url=None,
      prev_url=None,
      results=[]
    )

    self.assertEqual(len(self.queryset), 123)
    self.assertEqual(self.queryset.count(), 123)

  def test_slice_return_value(self):
    results = [{'id': 1}]

    self.cvat.tasks.return_value = ListResponse(
      count=1,
      next_url=None,
      prev_url=None,
      results=results
    )

    self.assertSequenceEqual(self.queryset[1:1], [])
    self.assertSequenceEqual(self.queryset[1:2], results)

  def test_slice_indices(self):
    self.queryset[0:10]
    self.assertEqual(self.cvat.tasks.call_args[0][0].page, 1)
    self.assertEqual(self.cvat.tasks.call_args[0][0].page_size, 10)

    self.queryset[10:20]
    self.assertEqual(self.cvat.tasks.call_args[0][0].page, 2)
    self.assertEqual(self.cvat.tasks.call_args[0][0].page_size, 10)

  def test_slice_iteration(self):
    results = [{'id': 1}]

    self.cvat.tasks.return_value = ListResponse(
      count=1,
      next_url=None,
      prev_url=None,
      results=results
    )

    self.queryset[1:2]
    self.assertSequenceEqual(list(self.queryset), results)
