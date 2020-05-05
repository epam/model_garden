from unittest import mock

from rest_framework.reverse import reverse
from rest_framework.test import APITestCase


class TestCvatUserViewSet(APITestCase):
  def setUp(self):
    self.cvat_service_cls_patcher = mock.patch('model_garden.views.cvat_user.CvatService')
    self.cvat_service_cls_mock = self.cvat_service_cls_patcher.start()
    self.cvat_service_mock = self.cvat_service_cls_mock.return_value
    self.cvat_service_mock.get_users.return_value = [{
      "id": 1,
      "username": "epam_labler",
      "first_name": "Epam",
      "last_name": "Labler",
      "email": "epam@labler.com"
    }]

  def tearDown(self):
    self.cvat_service_cls_patcher.stop()

  def test_list(self):
    response = self.client.get(
      path=reverse('cvat_users-list'),
    )

    self.assertEqual(
      response.json(),
      [{'email': 'epam@labler.com', 'full_name': 'Epam Labler', 'id': 1}],
    )
