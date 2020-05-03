from django.db import models

from model_garden.models import Bucket


class Dataset(models.Model):
  path = models.CharField(max_length=512)
  bucket = models.ForeignKey(Bucket, on_delete=models.CASCADE)

  class Meta:
    unique_together = [['path', 'bucket']]

  def __str__(self):
    return f"{self.__class__.__name__}(path='{self.path}', bucket='{self.bucket.name}')"
