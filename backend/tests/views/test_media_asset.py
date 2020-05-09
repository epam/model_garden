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
