import os
from collections import namedtuple
from typing import Iterable
from unittest import TestCase, mock

from django.test import override_settings
from parameterized import parameterized

from model_garden.services.s3 import (
  DELETE_REQUEST_LIMIT, DeleteError, S3Client, image_ext_filter, S3ServiceException,
)


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

  @override_settings(AWS_ACCESS_KEY_ID=None)
  @override_settings(AWS_SECRET_KEY=None)
  def test_new_client_with_null_credentials(self):
    with self.assertRaises(S3ServiceException):
        S3Client(bucket_name=self.bucket_name)

  @override_settings(AWS_ACCESS_KEY_ID='')
  @override_settings(AWS_SECRET_KEY='')
  def test_new_s3_client_with_empty_credentials(self):
    with self.assertRaises(S3ServiceException):
        S3Client(bucket_name=self.bucket_name)

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

  def test_delete_files_when_empty_call(self):
    self.bucket_mock.delete_objects.return_value = {}

    result = self.client.delete_files()

    self.bucket_mock.delete_objects.assert_not_called()
    self.assertListEqual(result, [])

  def test_delete_files_with_pagination(self):
    self.bucket_mock.delete_objects.return_value = {}

    keys_count = int(DELETE_REQUEST_LIMIT * 1.5)
    result = self.client.delete_files(*[str(i) for i in range(keys_count)])

    self.assertEqual(self.bucket_mock.delete_objects.call_count, 2)

    keys_sent = 0
    for i in range(2):
      keys_sent += len(self.bucket_mock.delete_objects.call_args_list[i][1]['Delete']['Objects'])
    self.assertEqual(keys_sent, keys_count)

    self.assertListEqual(result, [])

  def test_delete_files_with_error(self):
    self.bucket_mock.delete_objects.return_value = {
      'Errors': [
        {
          'Key': 'foo',
          'VersionId': 'string2',
          'Code': 'string3',
          'Message': 'string4',
        },
      ],
    }

    result = self.client.delete_files('foo')

    self.bucket_mock.delete_objects.assert_called_once()
    self.assertEqual(len(result), 1)
    self.assertEqual(
      result[0],
      DeleteError(
        key='foo',
        code='string3',
        message='string4',
        version_id='string2',
      ),
    )

  def test_delete_files_cuncurrent_when_tasks_more_than_executor_pool(self):
    default_threads_count = os.cpu_count() + 4
    keys_count = int(DELETE_REQUEST_LIMIT * default_threads_count * 1.5)

    with mock.patch.object(S3Client, 'delete_files') as delete_mock:
      delete_mock.return_value = []

      result = self.client.delete_files_concurrent(
        *[str(i) for i in range(keys_count)],
      )

      keys_sent = 0
      for call in delete_mock.call_args_list:
        keys_sent += len(call[0])
      self.assertEqual(keys_sent, keys_count)

    self.assertListEqual(result, [])

  def test_delete_files_cuncurrent_when_erros_raised(self):
    expected_exception = Exception('foo')

    keys_count = int(DELETE_REQUEST_LIMIT * 1.5)

    with mock.patch.object(S3Client, 'delete_files') as delete_mock:
      delete_mock.side_effect = expected_exception

      result = self.client.delete_files_concurrent(
        *[str(i) for i in range(keys_count)],
      )

    self.assertEqual(len(result), keys_count)
    for each in result:
      self.assertIsInstance(each, DeleteError)
      self.assertEqual(each.message, str(expected_exception))


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

