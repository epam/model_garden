import logging

from django_filters import rest_framework as filters
from django.conf import settings
from rest_framework import status
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from model_garden.models import Dataset, LabelingTask, Labeler
from model_garden.serializers import LabelingTaskCreateSerializer, LabelingTaskSerializer
from model_garden.services.cvat import CvatService, CVATServiceException
from model_garden.utils import chunkify

logger = logging.getLogger(__name__)


class LabelingTaskFilterSet(filters.FilterSet):
  labeler = filters.CharFilter(field_name='labeler__username')
  dataset = filters.CharFilter(field_name='media_assets__dataset__path')

  class Meta:
    model = LabelingTask
    fields = ('name', 'dataset', 'labeler', 'status')


class LabelingTaskViewSet(ModelViewSet):
  queryset = LabelingTask.objects.all()
  serializer_class = LabelingTaskSerializer
  filterset_class = LabelingTaskFilterSet

  def create(self, request: Request, *args, **kwargs) -> Response:
    cvat_service = CvatService()
    serializer = LabelingTaskCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.data
    assignee_id = data['assignee_id']
    dataset_id = data['dataset_id']
    files_in_task = data['files_in_task']
    count_of_tasks = data['count_of_tasks']
    task_name = data['task_name']

    try:
      dataset = Dataset.objects.get(id=dataset_id)
    except Dataset.DoesNotExist:
      raise ValidationError(detail={"message": f"Dataset with id='{dataset_id}' not found"})

    try:
      labeler = Labeler.objects.get(labeler_id=assignee_id)
    except Labeler.DoesNotExist:
      try:
        cvat_user = cvat_service.get_user(user_id=assignee_id)
      except CVATServiceException as e:
        logger.error(f"Assignee with id='{assignee_id}' not found in CVAT")
        raise NotFound(detail={'message': str(e)})
      else:
        labeler = Labeler.objects.create(
          labeler_id=cvat_user['id'],
          username=cvat_user['username'],
        )

    media_assets = dataset.media_assets.filter(labeling_task__isnull=True).all()[:count_of_tasks * files_in_task]
    for chunk_id, chunk in zip(range(count_of_tasks),
                               chunkify(media_assets, files_in_task)):
      logger.info(f"Creating task '{task_name}' with {len(chunk)} files")
      chunk_task_name = f"{task_name}.{(chunk_id + 1):02d}"
      try:
        task_data = cvat_service.create_task(
          name=chunk_task_name,
          assignee_id=assignee_id,
          owner_id=cvat_service.get_root_user()['id'],
          remote_files=[media_asset.remote_path for media_asset in chunk],
        )
      except CVATServiceException as e:
        return Response(data={'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
      else:
        labeling_task = LabelingTask.objects.create(
          name=chunk_task_name,
          labeler=labeler,
          url=f"http://{settings.CVAT_HOST}:{settings.CVAT_PORT}/tasks/{task_data['id']}",
        )
        for media_asset in chunk:
          media_asset.labeling_task = labeling_task
          media_asset.save()

    return Response(status=status.HTTP_201_CREATED)
