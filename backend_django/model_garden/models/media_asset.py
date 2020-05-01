from django.db import models

from model_garden.models import BucketItem


class MediaAsset(models.Model):
  bucket_item = models.ForeignKey(BucketItem, on_delete=models.CASCADE)
  filename = models.CharField(max_length=512)
