from django_filters import rest_framework as filters
from rest_framework import viewsets

from model_garden.models import Dataset
from model_garden.serializers import DatasetSerializer


class DatasetFilterSet(filters.FilterSet):
  bucket_name = filters.CharFilter(field_name='bucket__name')

  class Meta:
    model = Dataset
    fields = ('bucket_name', 'path')


class DatasetViewSet(viewsets.ModelViewSet):
  queryset = Dataset.objects.all()
  serializer_class = DatasetSerializer
  filterset_class = DatasetFilterSet
