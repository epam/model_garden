from unittest import mock

from tests import BaseAPITestCase

from rest_framework import status
from rest_framework.reverse import reverse


class MyTestCase(BaseAPITestCase):

    def setUp(self):
        super().setUp()
        self.s3_client_cls_patcher = mock.patch('model_garden.views.media_asset.S3Client')
        self.s3_client_mock = self.s3_client_cls_patcher.start().return_value

        self.dataset = self.test_factory.create_dataset()
        self.dataset_with_task = self.test_factory.create_dataset()
        self.test_factory.create_media_asset(dataset=self.dataset_with_task, assigned=True)

    def tearDown(self):
        self.s3_client_cls_patcher.stop()
        super().tearDown()

    def test_invalid_dataset_not_found(self):
        data = {
            "id": 9999,
        }
        response = self.client.post(reverse('dataset-delete'), data=data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {'message': "Dataset with id='9999' not found"})

    def test_invalid_dataset_assigned_task(self):
        data = {
            "id": self.dataset_with_task.id,
        }
        response = self.client.post(reverse('dataset-delete'), data=data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {'message': 'Dataset has assigned tasks'})

    def test_valid_delete(self):

        data = {
            "id": self.dataset.id,
        }
        response = self.client.post(reverse('dataset-delete'), data=data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
