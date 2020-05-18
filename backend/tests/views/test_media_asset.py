from collections import namedtuple
from io import BytesIO
from unittest import mock
from zipfile import ZipFile

from django.core.files.uploadedfile import SimpleUploadedFile
from freezegun import freeze_time
from rest_framework import status
from rest_framework.reverse import reverse

from model_garden.constants import MediaAssetStatus
from model_garden.models import MediaAsset
from tests import BaseAPITestCase


class TestMediaAssetViewSet(BaseAPITestCase):
  def setUp(self):
    super().setUp()
    self.dataset = self.test_factory.create_dataset()
    self.s3_client_cls_patcher = mock.patch('model_garden.views.media_asset.S3Client')
    self.s3_client_mock = self.s3_client_cls_patcher.start().return_value

  def tearDown(self):
    self.s3_client_cls_patcher.stop()
    super().tearDown()

  def test_list(self):
    self.test_factory.create_media_asset(dataset=self.dataset, status=MediaAssetStatus.PENDING)
    self.test_factory.create_media_asset(dataset=self.dataset, status=MediaAssetStatus.ASSIGNED)

    response = self.client.get(
      path=reverse('mediaasset-list'),
    )

    self.assertEqual(response.status_code, 200)
    self.assertEqual(len(response.json()['results']), 2)

  def test_list_with_status_filter(self):
    self.test_factory.create_media_asset(dataset=self.dataset, status=MediaAssetStatus.PENDING)
    self.test_factory.create_media_asset(dataset=self.dataset, status=MediaAssetStatus.ASSIGNED)

    response = self.client.get(
      path=reverse('mediaasset-list'),
      data={
        'status': MediaAssetStatus.PENDING,
      },
    )

    self.assertEqual(response.status_code, 200)
    self.assertEqual(len(response.json()['results']), 1)

  def test_list_with_bucket_id_filter(self):
    self.test_factory.create_media_asset(dataset=self.dataset, status=MediaAssetStatus.PENDING)
    self.test_factory.create_media_asset(dataset=self.dataset, status=MediaAssetStatus.ASSIGNED)

    response = self.client.get(
      path=reverse('mediaasset-list'),
      data={
        'bucket_id': self.dataset.bucket.id,
      },
    )

    self.assertEqual(response.status_code, 200)
    self.assertEqual(len(response.json()['results']), 2)

  def test_list_with_bucket_id_filter_empty(self):
    self.test_factory.create_media_asset(dataset=self.dataset, status=MediaAssetStatus.PENDING)
    self.test_factory.create_media_asset(dataset=self.dataset, status=MediaAssetStatus.ASSIGNED)

    response = self.client.get(
      path=reverse('mediaasset-list'),
      data={
        'bucket_id': 777,
      },
    )

    self.assertEqual(response.status_code, 200)
    self.assertEqual(len(response.json()['results']), 0)

  def test_list_with_dataset_id_filter(self):
    self.test_factory.create_media_asset(dataset=self.dataset, status=MediaAssetStatus.PENDING)
    self.test_factory.create_media_asset(dataset=self.dataset, status=MediaAssetStatus.ASSIGNED)

    response = self.client.get(
      path=reverse('mediaasset-list'),
      data={
        'dataset_id': self.dataset.id,
      },
    )

    self.assertEqual(response.status_code, 200)
    self.assertEqual(len(response.json()['results']), 2)

  def test_list_with_dataset_id_filter_empty(self):
    response = self.client.get(
      path=reverse('mediaasset-list'),
      data={
        'dataset_id': 777,
      },
    )

    self.assertEqual(response.status_code, 200)
    self.assertEqual(len(response.json()['results']), 0)

  def test_upload_missing_files_in_request(self):
    response = self.client.post(
      path=reverse('mediaasset-upload'),
    )

    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertEqual(response.json(), {'message': 'Missing files in request'})

  def test_upload_missing_bucket_id_in_request(self):
    response = self.client.post(
      path=reverse('mediaasset-upload'),
      data={
        'file': [BytesIO(initial_bytes=b"")],
      },
    )

    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertEqual(response.json(), {'message': "Missing 'bucketId' in request"})

  def test_upload_bucket_not_found(self):
    response = self.client.post(
      path=reverse('mediaasset-upload'),
      data={
        'bucketId': 666,
        'file': [BytesIO(initial_bytes=b"")],
      },
    )

    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertEqual(response.json(), {'message': "Bucket with id='666' not found"})

  def test_upload(self):
    uploaded_file = SimpleUploadedFile('test.txt', content=b"test", content_type='image')

    response = self.client.post(
      path=reverse('mediaasset-upload'),
      data={
        'bucketId': self.dataset.bucket.id,
        'file': [uploaded_file],
      },
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.json(), {'message': '1 media asset(s) uploaded'})
    self.assertEqual(MediaAsset.objects.count(), 1)
    self.s3_client_mock.upload_files.assert_called_once_with(files_to_upload=mock.ANY, bucket=self.dataset.bucket.name)

  @freeze_time("2020-05-15")
  def test_upload_media_asset_already_exists(self):
    uploaded_file = SimpleUploadedFile('test.txt', content=b"test", content_type='image')

    for _ in range(2):
      response = self.client.post(
        path=reverse('mediaasset-upload'),
        data={
          'bucketId': self.dataset.bucket.id,
          'file': [uploaded_file],
          'path': 'test',
        },
      )

    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertEqual(
      response.json(),
      {
        'message': "Media asset for dataset='test' and filename='test.txt' already exists",
      },
    )

  def test_upload_zip_file(self):
    file = BytesIO()
    zip_file = ZipFile(file=file, mode='w')
    zip_file.writestr('folder/', '')
    zip_file.writestr('test.txt', 'test')
    zip_file.close()
    uploaded_file = SimpleUploadedFile('test.txt', content=file.getvalue(), content_type='application/zip')
    file.close()

    response = self.client.post(
      path=reverse('mediaasset-upload'),
      data={
        'bucketId': self.dataset.bucket.id,
        'file': [uploaded_file],
      },
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)
    self.assertEqual(response.json(), {'message': "1 media asset(s) uploaded"})

  def test_upload_zip_file_not_a_zip(self):
    uploaded_file = SimpleUploadedFile('test.txt', content=b"", content_type='application/zip')

    response = self.client.post(
      path=reverse('mediaasset-upload'),
      data={
        'bucketId': self.dataset.bucket.id,
        'file': [uploaded_file],
      },
    )

    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertEqual(response.json(), {'message': "File 'test.txt' is not a zip file"})

  def test_upload_unexpected_content_type(self):
    uploaded_file = SimpleUploadedFile('test.txt', content=b"")

    response = self.client.post(
      path=reverse('mediaasset-upload'),
      data={
        'bucketId': self.dataset.bucket.id,
        'file': [uploaded_file],
      },
    )

    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(response.json(), {'message': "0 media asset(s) uploaded"})

  def test_upload_to_s3_fails(self):
    self.s3_client_mock.upload_files.side_effect = Exception("s3 error")
    uploaded_file = SimpleUploadedFile('test.txt', content=b"test", content_type='image')

    response = self.client.post(
      path=reverse('mediaasset-upload'),
      data={
        'bucketId': self.dataset.bucket.id,
        'file': [uploaded_file],
      },
    )

    self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
    self.assertEqual(response.json(), {'message': 's3 error'})

  def test_import_s3(self):
    Asset = namedtuple('Asset', 'key')

    with mock.patch('model_garden.views.media_asset.S3Client') as s3_mock:
      list_keys_mock = mock.MagicMock()
      list_keys_mock.list_keys.return_value = [
        Asset(key='foo/bar.jpg'),
      ]
      s3_mock.return_value = list_keys_mock

      response = self.client.post(
        path=reverse('mediaasset-import-s3'),
        data={
          'bucketId': self.dataset.bucket.id,
          'path': 'foo',
        },
      )

      self.assertEqual(response.status_code, status.HTTP_200_OK)
      self.assertEqual(response.json()['imported'], 1)

  def test_import_s3_with_wrong_bucket(self):
    response = self.client.post(
      path=reverse('mediaasset-import-s3'),
      data={
        'bucketId': 0,
        'path': 'foo',
      },
    )

    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
