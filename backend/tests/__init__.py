from typing import Optional

from django.test import TestCase
from rest_framework.test import APITestCase

from model_garden.constants import LabelingTaskStatus
from model_garden.models import Bucket, Dataset, MediaAsset, Labeler, LabelingTask


class Factory:
  _FILENAME_ID = 1
  _LABELER_ID = 0

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
    assigned: Optional[bool] = False,
  ) -> MediaAsset:
    if dataset is None:
      dataset = self.create_dataset()

    Factory._FILENAME_ID += 1

    media_asset = MediaAsset.objects.create(
      dataset=dataset,
      filename=f'image{Factory._FILENAME_ID}.jpg',
    )
    if assigned:
      labeling_task = self.create_labeling_task()
      media_asset.labeling_task = labeling_task
      media_asset.save()

    return media_asset

  def create_labeler(self, labeler_id: Optional[int] = None):
    if labeler_id is None:
      self._LABELER_ID += 1
      labeler_id = self._LABELER_ID

    return Labeler.objects.create(
      labeler_id=labeler_id,
      username='test_labeler',
    )

  def create_labeling_task(
      self,
      name: Optional[str] = 'Test labeling task',
      status: Optional[str] = LabelingTaskStatus.ANNOTATION,
  ):
    labeling_task = LabelingTask.objects.create(
      name=name,
      status=status,
      labeler=self.create_labeler(),
      url="http://localhost:8080/task/1",
    )
    return labeling_task


class BaseTestCase(TestCase):
  def setUp(self):
    super().setUp()
    self.test_factory = Factory()


class BaseAPITestCase(APITestCase):
  def setUp(self):
    super().setUp()
    self.test_factory = Factory()
