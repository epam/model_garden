from django.test import TestCase

from model_garden.models import Bucket


class TestBucket(TestCase):
  def setUp(self):
    self.bucket_name = 'test bucket'

  def test_str(self):
    bucket = Bucket(name=self.bucket_name)

    self.assertEqual(str(bucket), f"Bucket('{self.bucket_name}')")

  def test_create(self):
    bucket = Bucket(name=self.bucket_name)
    bucket.save()

    self.assertEqual(Bucket.objects.count(), 1)
