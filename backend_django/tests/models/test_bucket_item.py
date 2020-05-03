from django.test import TestCase

from model_garden.models import Bucket, BucketItem


class TestBucketItem(TestCase):
  def setUp(self):
    self.bucket_name = 'test bucket'
    self.bucket = Bucket(name=self.bucket_name)
    self.bucket.save()
    self.bucket_item_path = 'path'

  def test_str(self):
    bucket_item = BucketItem(path=self.bucket_item_path, bucket=self.bucket)

    self.assertEqual(str(bucket_item), f"BucketItem(path='{self.bucket_item_path}', bucket='{self.bucket.name}')")

  def test_create(self):
    bucket_item = BucketItem(path=self.bucket_item_path, bucket=self.bucket)
    bucket_item.save()

    self.assertEqual(BucketItem.objects.count(), 1)
