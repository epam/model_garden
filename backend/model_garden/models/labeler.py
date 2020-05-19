from django.db import models

from model_garden.models import BaseModel


class Labeler(BaseModel):
  labeler_id = models.IntegerField()
  username = models.CharField(
    max_length=150,
    unique=True,
  )

  def __str__(self):
    return f"{self.__class__.__name__}(labeler_id={self.labeler_id}, username='{self.username}')"
