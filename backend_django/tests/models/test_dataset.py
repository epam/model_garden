from django.test import TestCase

from model_garden.models import Bucket, Dataset


class TestDataset(TestCase):
  def setUp(self):
    self.bucket_name = 'test bucket'
    self.bucket = Bucket(name=self.bucket_name)
    self.bucket.save()
    self.dataset_path = 'path'

  def test_str(self):
    dataset = Dataset(path=self.dataset_path, bucket=self.bucket)

    self.assertEqual(str(dataset), f"Dataset(path='{self.dataset_path}', bucket='{self.bucket.name}')")

  def test_create(self):
    dataset = Dataset(path=self.dataset_path, bucket=self.bucket)
    dataset.save()

    self.assertEqual(Dataset.objects.count(), 1)
