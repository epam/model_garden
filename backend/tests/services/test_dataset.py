from unittest import TestCase, mock
from model_garden.services import DatasetService
from model_garden.services.s3 import (
  S3Client,
)


class TestDatasetService(TestCase):
  def setUp(self):
    self.bucket_name = 'bucket-name'
    self.resource_patcher = mock.patch('model_garden.services.s3.resource')
    self.resource_mock = self.resource_patcher.start()
    self.s3_mock = self.resource_mock.return_value
    self.bucket_mock = self.s3_mock.Bucket.return_value
    self.client = S3Client(bucket_name=self.bucket_name)
    self.data_service = DatasetService()

  def tearDown(self):
    self.resource_patcher.stop()

  def test_delete_files_in_s3(self):
    result = self.data_service.delete_files_in_s3("bucket1", ["img1.jpg"])
    self.assertEqual(result, [])
