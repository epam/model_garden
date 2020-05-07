from typing import Optional

from django.test import TestCase
from freezegun import freeze_time

from model_garden.models import Bucket, Dataset
from model_garden.serializers import DatasetSerializer


class TestDatasetSerializer(TestCase):
  def setUp(self):
    self.bucket = Bucket.objects.create(name='test bucket')

  def _save_dataset(self, path: Optional[str] = 'test') -> Dataset:
    serializer = DatasetSerializer(data={
      'path': path,
      'bucket': self.bucket.pk,
    })
    serializer.is_valid()
    return serializer.save()

  @freeze_time('2020-05-01')
  def test_create(self):
    saved_dataset = self._save_dataset()

    dataset = Dataset.objects.get(pk=saved_dataset.pk)

    self.assertEqual(dataset.path, 'test_2020-05-01')

  @freeze_time('2020-05-01')
  def test_create_path_param_is_missing(self):
    saved_dataset = self._save_dataset(path=None)

    dataset = Dataset.objects.get(pk=saved_dataset.pk)

    self.assertEqual(dataset.path, 'batch_2020-05-01')

  def test_create_already_exists(self):
    saved_dataset_1 = self._save_dataset()
    saved_dataset_2 = self._save_dataset()

    self.assertEqual(saved_dataset_1, saved_dataset_2)
    self.assertEqual(Dataset.objects.count(), 1)
