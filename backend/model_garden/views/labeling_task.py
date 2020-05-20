import logging

from django_filters import rest_framework as filters
from django_filters.rest_framework import DjangoFilterBackend
from django.conf import settings
from rest_framework import status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.db.models import F

from model_garden.constants import LabelingTaskStatus
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


class LabelingTaskOrderingFilter(OrderingFilter):
  """To keep the API query names consistent with the `LabelingTaskFilterSet`,
  the ordering must be applied to the different field that is requested.
  """
  REPLACE_REQUEST_FIELDS = {
    'labeler': 'labeler_name',
  }

  def get_ordering(self, request, queryset, view):
    ordering = super().get_ordering(request, queryset, view)
    return [self._replace_request_field(field) for field in ordering or []]

  @classmethod
  def _replace_request_field(cls, field: str) -> str:
    for searched, needed in cls.REPLACE_REQUEST_FIELDS.items():
      if searched in field:
        return field.replace(searched, needed)

    return field


class LabelingTaskViewSet(ModelViewSet):
  queryset = (
    LabelingTask.objects
    .annotate(labeler_name=F('labeler__username'))
    .annotate(dataset=F('media_assets__dataset__path'))
    .all()
  )
  serializer_class = LabelingTaskSerializer
  filterset_class = LabelingTaskFilterSet
  filter_backends = [
    DjangoFilterBackend, SearchFilter, LabelingTaskOrderingFilter,
  ]
  ordering_fields = ('name', 'dataset', 'labeler', 'status', 'url')
  search_fields = ('name', 'dataset', 'labeler_name', 'status', 'url')

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
          task_id=task_data['id'],
          name=chunk_task_name,
          labeler=labeler,
          url=f"http://{settings.CVAT_HOST}:{settings.CVAT_PORT}/tasks/{task_data['id']}",
        )
        for media_asset in chunk:
          media_asset.labeling_task = labeling_task
          media_asset.save()

    return Response(status=status.HTTP_201_CREATED)

  def list(self, request: Request, *args, **kwargs) -> Response:
    queryset = self.filter_queryset(self.get_queryset())
    page = self.paginate_queryset(queryset)

    # NOTE: The following code is not optimal, but cvat does not provide
    # API to get list of tasks by list of ids, so we have to get tasks
    # one by one for all tasks with non-completed status.
    items_to_check = [item for item in page if item.status != LabelingTaskStatus.COMPLETED]
    if items_to_check:
      cvat_service = CvatService()
      for item in items_to_check:
        task = cvat_service.get_task(item.task_id)
        task_status = task.get('status')
        if status is not None and item.status != task_status:
          item.status = task_status
          item.save(update_fields=('status',))

    serializer = self.get_serializer(page, many=True)
    return self.get_paginated_response(serializer.data)
