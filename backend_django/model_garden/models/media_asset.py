import os

from django.db import models

from model_garden.models import Dataset


class MediaAsset(models.Model):
  dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE)
  filename = models.CharField(max_length=512)

  @property
  def full_path(self):
    return os.path.join(self.dataset.path, self.filename)
