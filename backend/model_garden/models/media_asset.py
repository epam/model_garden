from urllib.parse import urljoin, quote

from django.db import models

from model_garden.constants import DatasetFormat
from model_garden.models import BaseModel


class MediaAsset(BaseModel):
  dataset = models.ForeignKey(
    'Dataset',
    on_delete=models.CASCADE,
    related_name='media_assets',
  )
  filename = models.CharField(max_length=512)
  labeling_asset_filepath = models.CharField(max_length=512, blank=True, null=True)
  labeling_task = models.ForeignKey(
    'LabelingTask',
    null=True,
    blank=True,
    on_delete=models.SET_NULL,
    related_name='media_assets',
  )

  class Meta:
    ordering = ['-created_at']
    unique_together = [['filename', 'dataset']]

  @property
  def full_path(self):
    return f"{self.dataset.path.strip('/')}/{self.filename}"

  @property
  def remote_path(self):
    return urljoin(self.dataset.bucket.url, quote(self.full_path))

  @property
  # TODO: return
  def full_label_path(self):
    if self.dataset.dataset_format == DatasetFormat.YOLO:
      return f"{self.full_path}.txt"
    else:
      return f"{self.full_path}.xml"

  # TODO:remove deprecated remote_label_path property
  @property
  def remote_label_path(self):
    if self.dataset.dataset_format == DatasetFormat.YOLO:
      return f"{self.remote_path}.txt"
    else:
      return f"{self.remote_path}.xml"
