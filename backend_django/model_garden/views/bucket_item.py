from rest_framework import viewsets

from model_garden.models import BucketItem
from model_garden.serializers import BucketItemSerializer


class BucketItemViewSet(viewsets.ModelViewSet):
  queryset = BucketItem.objects.all()
  serializer_class = BucketItemSerializer
