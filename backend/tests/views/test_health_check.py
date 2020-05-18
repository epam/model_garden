from rest_framework import status

from tests import BaseAPITestCase


class TestHealthCheck(BaseAPITestCase):
  def test_get(self):
    response = self.client.get(
      path='/health_check/',
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.content.decode(), 'ok')
