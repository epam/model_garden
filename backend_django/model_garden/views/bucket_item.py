from django_filters import rest_framework as filters
from rest_framework import viewsets

from model_garden.models import BucketItem
from model_garden.serializers import BucketItemSerializer


class BucketItemFilterSet(filters.FilterSet):
  bucket_name = filters.CharFilter(field_name='bucket__name')

  class Meta:
    model = BucketItem
    fields = ('bucket_name', 'path')


class BucketItemViewSet(viewsets.ModelViewSet):
  queryset = BucketItem.objects.all()
  serializer_class = BucketItemSerializer
  filterset_class = BucketItemFilterSet
