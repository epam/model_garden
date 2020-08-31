from django.db import models

from model_garden.constants import DatasetFormat
from model_garden.models import BaseModel, Bucket


class Dataset(BaseModel):
    FORMATS = [
        (DatasetFormat.PASCAL_VOC, 'Pascal VOC'),
        (DatasetFormat.YOLO, 'YOLO'),
    ]

    path = models.CharField(max_length=512)
    bucket = models.ForeignKey(Bucket, on_delete=models.CASCADE)

    dataset_format = models.CharField(
        max_length=16,
        choices=FORMATS,
        default=DatasetFormat.PASCAL_VOC,
    )

    class Meta:
        ordering = ('-created_at',)
        unique_together = [['path', 'bucket']]

    def __str__(self):
        return (f"{self.__class__.__name__}(path='{self.path}', bucket='{self.bucket.name}', "
                f"dataset_format='{self.dataset_format}')")
