import os

from django.db import models

from model_garden.models import BucketItem


class MediaAsset(models.Model):
  bucket_item = models.ForeignKey(BucketItem, on_delete=models.CASCADE)
  filename = models.CharField(max_length=512)

  @property
  def full_path(self):
    return os.path.join(self.bucket_item.path, self.filename)
