from django.db import models


class Bucket(models.Model):
    name = models.CharField(max_length=63)
