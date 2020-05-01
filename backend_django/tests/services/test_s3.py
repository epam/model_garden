from unittest import TestCase, mock

from model_garden.services.s3 import S3Client


class TestS3Client(TestCase):
  def setUp(self):
    self.bucket_name = 'bucket-name'
    self.resource_patcher = mock.patch('model_garden.services.s3.resource')
    self.resource_mock = self.resource_patcher.start()
    self.s3_mock = self.resource_mock.return_value
    self.bucket_mock = self.s3_mock.Bucket.return_value
    self.client = S3Client(bucket_name=self.bucket_name)

  def tearDown(self):
    self.resource_patcher.stop()

  def test_list_bucket(self):
    object_mock = mock.Mock()
    self.bucket_mock.objects.all.return_value = [object_mock]

    result = self.client.list_bucket()

    self.assertEqual(result, [object_mock])

  def test_download_file(self):
    self.client.download_file(key='key', filename='filename')

    self.bucket_mock.meta.client.download_file.assert_called_once_with(
      self.bucket_name, 'key', 'filename',
    )

  def test_upload_file(self):
    self.client.upload_file(filename='filename', key='key')

    self.bucket_mock.meta.client.upload_file.assert_called_once_with(
      'filename', self.bucket_name, 'key',
    )
