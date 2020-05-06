from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from model_garden.constants import MediaAssetStatus
from model_garden.models import Bucket, Dataset, MediaAsset


class TestMediaAssetViewSet(APITestCase):
  def setUp(self):
    self.bucket_name = 'test_bucket'
    self.bucket_url = 'https://d3o54g14k1n39o.cloudfront.net/'
    self.bucket = Bucket.objects.create(
      name=self.bucket_name,
      url=self.bucket_url,
    )
    self.dataset = Dataset.objects.create(
      path='test path',
      bucket=self.bucket
    )
    self._create_media_asset(status=MediaAssetStatus.PENDING)
    self._create_media_asset(status=MediaAssetStatus.ASSIGNED)

  def _create_media_asset(self, status=MediaAssetStatus.PENDING):
    return MediaAsset.objects.create(
      dataset=self.dataset,
      filename='image.jpg',
      status=status,
    )

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
        'bucket_id': self.bucket.id,
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
