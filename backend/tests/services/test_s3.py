from typing import Iterable
from collections import namedtuple
from unittest import TestCase, mock

from parameterized import parameterized

from model_garden.services.s3 import S3Client, image_ext_filter


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

  def test_list_keys_without_filter(self):
    object_mock = mock.Mock()
    self.bucket_mock.objects.filter.return_value = [object_mock]

    result = self.client.list_keys('foo')

    self.assertIsInstance(result, Iterable)
    self.assertEqual(list(result), [object_mock])

  def test_list_keys_with_filter(self):
    object_mock = mock.Mock()
    self.bucket_mock.objects.filter.return_value = [object_mock, mock.Mock()]

    result = self.client.list_keys('foo', filter_by=lambda o: o is object_mock)

    self.assertIsInstance(result, Iterable)
    self.assertEqual(list(result), [object_mock])

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

  def test_upload_file_obj(self):
    file_obj_mock = mock.Mock()

    self.client.upload_file_obj(file_obj=file_obj_mock, bucket=self.bucket_name, key='key')

    self.bucket_mock.meta.client.upload_fileobj.assert_called_once_with(
      file_obj_mock, self.bucket_name, 'key',
    )

  def test_upload_files(self):
    file_obj_mock = mock.Mock()

    self.client.upload_files(
      files_to_upload=[
        (file_obj_mock, 'test1.txt'),
        (file_obj_mock, 'test2.txt'),
      ],
      bucket=self.bucket_name,
    )

    self.bucket_mock.meta.client.upload_fileobj.assert_has_calls([
      mock.call(file_obj_mock, self.bucket_name, 'test1.txt'),
      mock.call(file_obj_mock, self.bucket_name, 'test2.txt'),
    ])


class TestImageExtFilter(TestCase):

  @parameterized.expand([
    ('', False),
    ('foo', False),
    ('foo/bar', False),
    ('.png', False),
    ('foo.bar', False),
    ('foo/bar/baz.bmp', True),
    ('foo.jpg', True),
  ])
  def test_image_ext_filter(self, key, expected):
    ObjectSummary = namedtuple('ObjectSummary', 'key')

    self.assertIs(image_ext_filter(ObjectSummary(key=key)), expected)

  def test_when_empty_input(self):
    self.assertFalse(image_ext_filter(None))
