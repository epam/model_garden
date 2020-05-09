from model_garden.models import Bucket
from tests import BaseTestCase


class TestBucket(BaseTestCase):
  def setUp(self):
    super().setUp()
    self.bucket = self.test_factory.create_bucket()

  def test_str(self):

    self.assertEqual(str(self.bucket), f"Bucket(name='{self.bucket.name}', url='{self.bucket.url}')")

  def test_repr(self):
    self.assertEqual(repr(self.bucket), f"<Bucket(name='{self.bucket.name}', url='{self.bucket.url}')>")

  def test_create(self):
    self.assertEqual(Bucket.objects.filter(pk=self.bucket.pk).count(), 1)
