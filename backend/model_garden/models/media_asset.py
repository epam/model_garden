from urllib.parse import urljoin

from django.db import models

from model_garden.constants import MediaAssetStatus
from model_garden.models import BaseModel, Dataset


class MediaAsset(BaseModel):
  dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name='media_assets')
  filename = models.CharField(max_length=512)
  status = models.CharField(
    max_length=32,
    choices=[
      (MediaAssetStatus.PENDING, "Pending"),
      (MediaAssetStatus.ASSIGNED, "Assigned"),
    ],
    default=MediaAssetStatus.PENDING,
  )

  class Meta:
    ordering = ['-created_at']
    unique_together = [['filename', 'dataset']]

  @property
  def full_path(self):
    return f"{self.dataset.path}/{self.filename}"

  @property
  def remote_path(self):
    return urljoin(self.dataset.bucket.url, self.full_path)
