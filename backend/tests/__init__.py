from io import BytesIO
from typing import Optional
from zipfile import ZipFile

from django.test import TestCase, TransactionTestCase
from rest_framework.test import APITestCase

from model_garden.constants import LabelingTaskStatus
from model_garden.models import Bucket, Dataset, MediaAsset, Labeler, LabelingTask


class Factory:
  _FILENAME_ID = 1
  _LABELER_ID = 0
  _LABELING_TASK_ID = 0

  def create_bucket(self) -> Bucket:
    return Bucket.objects.create(
      name='test_bucket',
      url='https://d3o54g14k1n39o.cloudfront.net/',
    )

  def create_dataset(self, path: Optional[str] = 'test_path') -> Dataset:
    return Dataset.objects.create(
      path=path,
      bucket=self.create_bucket(),
    )

  def create_media_asset(
    self,
    dataset: Optional[Dataset] = None,
    filename: Optional[str] = None,
    assigned: Optional[bool] = False,
  ) -> MediaAsset:
    if dataset is None:
      dataset = self.create_dataset()

    if filename is None:
      Factory._FILENAME_ID += 1
      filename = f'image{Factory._FILENAME_ID}.jpg'

    media_asset = MediaAsset.objects.create(
      dataset=dataset,
      filename=filename,
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
      username=f'test_labeler_{labeler_id}',
    )

  def create_labeling_task(
      self,
      name: Optional[str] = 'Test labeling task',
      status: Optional[str] = LabelingTaskStatus.ANNOTATION,
  ):
    self._LABELING_TASK_ID += 1
    labeling_task = LabelingTask.objects.create(
      task_id=self._LABELING_TASK_ID,
      name=name,
      status=status,
      labeler=self.create_labeler(),
      url="http://localhost:8080/task/1",
    )
    return labeling_task

  @staticmethod
  def get_zip_file(*files):
    file = BytesIO()
    zip_file = ZipFile(file=file, mode='w')
    for file_path, file_content in files:
      zip_file.writestr(file_path, file_content)

    zip_file.close()
    return file.getvalue()


class BaseTestCase(TestCase):
  def setUp(self):
    super().setUp()
    self.test_factory = Factory()


class BaseAPITestCase(APITestCase):
  def setUp(self):
    super().setUp()
    self.test_factory = Factory()


class BaseTransactionTestCase(TransactionTestCase):
  def setUp(self):
    super().setUp()
    self.test_factory = Factory()
