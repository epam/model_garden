from typing import Optional

from django.test import TestCase
from rest_framework.test import APITestCase

from model_garden.constants import MediaAssetStatus
from model_garden.models import Bucket, Dataset, MediaAsset


class Factory:
  def create_bucket(self) -> Bucket:
    return Bucket.objects.create(
      name='test_bucket',
      url='https://d3o54g14k1n39o.cloudfront.net/',
    )

  def create_dataset(self) -> Dataset:
    return Dataset.objects.create(
      path='test_path',
      bucket=self.create_bucket(),
    )

  def create_media_asset(
    self,
    dataset: Optional[Dataset] = None,
    status: str = MediaAssetStatus.PENDING,
  ) -> MediaAsset:
    if dataset is None:
      dataset = self.create_dataset()

    return MediaAsset.objects.create(
      dataset=dataset,
      filename='image.jpg',
      status=status,
    )


class BaseTestCase(TestCase):
  def setUp(self):
    super().setUp()
    self.test_factory = Factory()


class BaseAPITestCase(APITestCase):
  def setUp(self):
    super().setUp()
    self.test_factory = Factory()
