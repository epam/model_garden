from collections import namedtuple
from unittest import mock

from rest_framework import status
from rest_framework.reverse import reverse

from model_garden.constants import MediaAssetStatus
from tests import BaseAPITestCase


class TestMediaAssetViewSet(BaseAPITestCase):
  def setUp(self):
    super().setUp()
    self.dataset = self.test_factory.create_dataset()
    self.test_factory.create_media_asset(dataset=self.dataset, status=MediaAssetStatus.PENDING)
    self.test_factory.create_media_asset(dataset=self.dataset, status=MediaAssetStatus.ASSIGNED)

  def test_list(self):
    response = self.client.get(
      path=reverse('mediaasset-list'),
    )

    self.assertEqual(response.status_code, 200)
    self.assertEqual(len(response.json()['results']), 2)

  def test_list_with_status_filter(self):
    response = self.client.get(
      path=reverse('mediaasset-list'),
      data={
        'status': MediaAssetStatus.PENDING,
      },
    )

    self.assertEqual(response.status_code, 200)
    self.assertEqual(len(response.json()['results']), 1)

  def test_list_with_bucket_id_filter(self):
    response = self.client.get(
      path=reverse('mediaasset-list'),
      data={
        'bucket_id': self.dataset.bucket.id,
      },
    )

    self.assertEqual(response.status_code, 200)
    self.assertEqual(len(response.json()['results']), 2)

  def test_list_with_bucket_id_filter_empty(self):
    response = self.client.get(
      path=reverse('mediaasset-list'),
      data={
        'bucket_id': 777,
      },
    )

    self.assertEqual(response.status_code, 200)
    self.assertEqual(len(response.json()['results']), 0)

  def test_list_with_dataset_id_filter(self):
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
