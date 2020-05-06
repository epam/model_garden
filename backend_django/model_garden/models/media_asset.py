import os

from django.db import models

from model_garden.constants import MediaAssetStatus
from model_garden.models import BaseModel, Dataset


class MediaAsset(BaseModel):
  dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE)
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

  @property
  def full_path(self):
    return os.path.join(self.dataset.path, self.filename)
