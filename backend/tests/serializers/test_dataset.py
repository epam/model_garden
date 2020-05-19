from typing import Optional

from freezegun import freeze_time
from rest_framework import serializers

from model_garden.models import Dataset
from model_garden.serializers import (
  DatasetRawPathSerializer,
  DatasetSerializer,
)
from tests import BaseTestCase


class TestDatasetSerializer(BaseTestCase):
  def setUp(self):
    super().setUp()
    self.bucket = self.test_factory.create_bucket()

  def _save_dataset(self, path: Optional[str] = 'test') -> Dataset:
    serializer = DatasetSerializer(data={
      'path': path,
      'bucket': self.bucket.pk,
    })
    serializer.is_valid()
    return serializer.save()

  def test_create(self):
    saved_dataset = self._save_dataset()

    dataset = Dataset.objects.get(pk=saved_dataset.pk)

    self.assertEqual(dataset.path, 'test')
    self.assertEqual(dataset.bucket, self.bucket)

  def test_create_path_with_slashes(self):
    saved_dataset = self._save_dataset(path='///test//')

    dataset = Dataset.objects.get(pk=saved_dataset.pk)

    self.assertEqual(dataset.path, 'test')
    self.assertEqual(dataset.bucket, self.bucket)

  @freeze_time('2020-05-01')
  def test_create_path_param_is_missing(self):
    saved_dataset = self._save_dataset(path=None)

    dataset = Dataset.objects.get(pk=saved_dataset.pk)

    self.assertEqual(dataset.path, 'batch_2020-05-01')
    self.assertEqual(dataset.bucket, self.bucket)

  def test_create_already_exists(self):
    saved_dataset_1 = self._save_dataset()
    saved_dataset_2 = self._save_dataset()

    self.assertEqual(saved_dataset_1, saved_dataset_2)
    self.assertEqual(Dataset.objects.count(), 1)

  def test_validate_when_bucket_not_provided(self):
    serializer = DatasetSerializer(data={
      'path': 'foo',
    })
    self.assertFalse(serializer.is_valid())

  def test_validate_when_bucket_is_not_exist(self):
    serializer = DatasetSerializer(data={
      'path': 'foo',
      'bucket': 0,
    })
    self.assertFalse(serializer.is_valid())


class TestDatasetRawPathSerializer(BaseTestCase):
  def setUp(self):
    super().setUp()
    self.bucket = self.test_factory.create_bucket()

  def test_path_was_not_changed(self):
    serializer = DatasetRawPathSerializer(data={
      'path': 'foo',
      'bucket': self.bucket.pk,
    })
    serializer.is_valid(raise_exception=True)
    self.assertEqual(serializer.validated_data['path'], 'foo')

  def test_when_path_is_not_passed(self):
    serializer = DatasetRawPathSerializer(data={
      'bucket': self.bucket.pk,
    })

    with self.assertRaises(serializers.ValidationError):
      serializer.is_valid(raise_exception=True)

  def test_when_path_is_empty(self):
    serializer = DatasetRawPathSerializer(data={
      'path': '',
      'bucket': self.bucket.pk,
    })

    with self.assertRaises(serializers.ValidationError):
      serializer.is_valid(raise_exception=True)
