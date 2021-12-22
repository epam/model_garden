import logging

from django_filters import rest_framework as filters

from model_garden.serializers import DatasetSerializer, DatasetIDSerializer
from model_garden.models import Dataset
from model_garden.services import DatasetService

from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

logger = logging.getLogger(__name__)


class DatasetFilterSet(filters.FilterSet):
  bucket_id = filters.CharFilter(field_name='bucket__id')

  class Meta:
    model = Dataset
    fields = ('bucket_id', 'path')


class DatasetViewSet(viewsets.ModelViewSet):
  queryset = Dataset.objects.all()
  serializer_class = DatasetSerializer
  filterset_class = DatasetFilterSet

  @action(methods=["POST"], detail=False)
  def delete(self, request):
    """Creates a POST request with the dataset ID
    Request::
        {"id": id}

    Response::
        {HTTP_400_BAD_REQUEST} if id doesn't exist in db
        {HTTP_200_OK} for successful deletion
    """
    dataset_serializer = DatasetIDSerializer(data=request.data)
    dataset_serializer.is_valid(raise_exception=True)
    dataset_service = DatasetService()

    try:
      dataset_to_delete = Dataset.objects.get(id=dataset_serializer.initial_data['id'])
    except Dataset.DoesNotExist:
      raise ValidationError(detail={"message": f"Dataset with id='{dataset_serializer.initial_data['id']}' not found"})

    media_asset_with_task = dataset_to_delete.media_assets.filter(labeling_task__isnull=False).all()
    media_assets_to_delete = dataset_to_delete.media_assets.filter(labeling_task__isnull=True).all()

    # Check if exists tasks assigned to the dataset
    if len(media_asset_with_task) > 0:
      return Response(
         data={'message': "Dataset has assigned tasks"},
         status=status.HTTP_400_BAD_REQUEST,
      )

    dataset_service.delete_media_assets_by_dataset(media_assets_to_delete)
    dataset_to_delete.delete()

    return Response(
      status=status.HTTP_200_OK,
    )
