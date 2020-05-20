from django.db import models

from model_garden.constants import LabelingTaskStatus
from model_garden.models import BaseModel


class LabelingTask(BaseModel):
  task_id = models.IntegerField()
  name = models.CharField(max_length=256)
  status = models.CharField(
    max_length=16,
    choices=[
      (LabelingTaskStatus.ANNOTATION, "Annotation"),
      (LabelingTaskStatus.VALIDATION, "Validation"),
      (LabelingTaskStatus.COMPLETED, "Completed"),
    ],
    default=LabelingTaskStatus.ANNOTATION,
  )
  labeler = models.ForeignKey(
    'Labeler',
    on_delete=models.CASCADE,
    related_name='labeling_tasks',
  )
  url = models.CharField(max_length=128)

  class Meta:
    ordering = ['-created_at']

  def __str__(self):
    return (
      f"{self.__class__.__name__}(task_id={self.task_id}, name='{self.name}', status='{self.status}', "
      f"labeler='{self.labeler.username}')"
    )
