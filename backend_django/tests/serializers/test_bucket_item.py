from typing import Optional

from django.test import TestCase
from freezegun import freeze_time

from model_garden.models import Bucket, BucketItem
from model_garden.serializers import BucketItemSerializer


class TestBucketItemSerializer(TestCase):
  def setUp(self):
    self.bucket = Bucket.objects.create(name='test bucket')

  def _save_bucket_item(self, path: Optional[str] = 'test') -> BucketItem:
    serializer = BucketItemSerializer(data={
      'path': path,
      'bucket': self.bucket.pk,
    })
    serializer.is_valid()
    return serializer.save()

  @freeze_time('2020-05-01')
  def test_create(self):
    saved_bucket_item = self._save_bucket_item()

    bucket_item = BucketItem.objects.get(pk=saved_bucket_item.pk)

    self.assertEqual(bucket_item.path, 'test_2020-05-01')

  @freeze_time('2020-05-01')
  def test_create_path_param_is_missing(self):
    saved_bucket_item = self._save_bucket_item(path=None)

    bucket_item = BucketItem.objects.get(pk=saved_bucket_item.pk)

    self.assertEqual(bucket_item.path, 'batch_2020-05-01')

  def test_create_already_exists(self):
    saved_bucket_item_1 = self._save_bucket_item()
    saved_bucket_item_2 = self._save_bucket_item()

    self.assertEqual(saved_bucket_item_1, saved_bucket_item_2)
    self.assertEqual(BucketItem.objects.count(), 1)
