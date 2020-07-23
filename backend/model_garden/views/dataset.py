from django_filters import rest_framework as filters
from rest_framework import viewsets

from model_garden.models import Dataset
from model_garden.serializers import DatasetSerializer


class DatasetFilterSet(filters.FilterSet):
  bucket_id = filters.CharFilter(field_name='bucket__id')

  class Meta:
    model = Dataset
    fields = ('bucket_id', 'path')


class DatasetViewSet(viewsets.ModelViewSet):
  queryset = Dataset.objects.all()
  serializer_class = DatasetSerializer
  filterset_class = DatasetFilterSet
