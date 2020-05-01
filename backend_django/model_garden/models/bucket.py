from django.db import models


class Bucket(models.Model):
  name = models.CharField(max_length=63)

  def __str__(self):
    return f"{self.__class__.__name__}(name='{self.name}')"
