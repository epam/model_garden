from unittest import mock

from django.test.utils import override_settings
from rest_framework.reverse import reverse
from tests import BaseAPITestCase


class TestCvatUserViewSet(BaseAPITestCase):
  def setUp(self):
    super().setUp()
    self.cvat_service_cls_patcher = mock.patch('model_garden.views.cvat_user.CvatService')
    self.cvat_service_cls_mock = self.cvat_service_cls_patcher.start()
    self.cvat_service_mock = self.cvat_service_cls_mock.return_value
    self.cvat_service_mock.get_users.return_value = [{
      "id": 1,
      "username": "",
      "first_name": "Epam",
      "last_name": "Labler",
      "email": "epam@labler.com",
    }]

  def tearDown(self):
    self.cvat_service_cls_patcher.stop()

  @override_settings(CVAT_ROOT_USER_NAME='admin')
  def test_list(self):
    response = self.client.get(
      path=reverse('cvatusers-list'),
    )

    self.assertEqual(
      response.json(),
      [{'email': 'epam@labler.com', 'full_name': 'Epam Labler', 'id': 1}],
    )
