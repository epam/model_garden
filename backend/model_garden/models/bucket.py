from django.db import models

from model_garden.models import BaseModel


class Bucket(BaseModel):
  name = models.CharField(max_length=63)
  url = models.URLField()

  class Meta:
    ordering = ('-created_at',)

  def __str__(self):
    return f"{self.__class__.__name__}(name='{self.name}', url='{self.url}')"

  def __repr__(self):
    return f"<{self}>"
