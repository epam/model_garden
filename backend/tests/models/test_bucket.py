from django.test import TestCase

from model_garden.models import Bucket


class TestBucket(TestCase):
  def setUp(self):
    self.name = 'test bucket'
    self.url = 'https://d3o54g14k1n39o.cloudfront.net/'

  def test_str(self):
    bucket = Bucket(name=self.name, url=self.url)

    self.assertEqual(str(bucket), f"Bucket(name='{self.name}', url='{self.url}')")

  def test_create(self):
    bucket = Bucket(name=self.name, url=self.url)
    bucket.save()

    self.assertEqual(Bucket.objects.filter(pk=bucket.pk).count(), 1)
