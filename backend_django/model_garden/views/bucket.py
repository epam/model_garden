from rest_framework import viewsets

from model_garden.models import Bucket
from model_garden.serializers import BucketSerializer


class BucketViewSet(viewsets.ModelViewSet):
  queryset = Bucket.objects.all()
  serializer_class = BucketSerializer
