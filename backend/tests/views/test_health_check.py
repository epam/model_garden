from unittest import mock

from rest_framework import status

from tests import BaseAPITestCase


class TestHealthCheck(BaseAPITestCase):

  def test_get(self):
    response = self.client.get(
      path='/health_check/',
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.content.decode(), 'ok')

  @mock.patch('model_garden.views.health_check.CvatService')
  def test_get_cvat(self, cvat_service_mock):
    response = self.client.get(
      path='/health_check/',
      data={
        'cvat': True,
      },
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    cvat_service_mock.assert_called_once_with()

  @mock.patch('model_garden.views.health_check.CvatService')
  def test_get_cvat_failed_to_connect(self, cvat_service_mock):
    cvat_service_mock.side_effect = Exception("cvat error")

    response = self.client.get(
      path='/health_check/',
      data={
        'cvat': True,
      },
    )

    self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
    self.assertEqual(response.content, b'Failed to connect to CVAT: cvat error')
    cvat_service_mock.assert_called_once_with()
