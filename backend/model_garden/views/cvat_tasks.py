from typing import Iterable, Iterator

from django import forms
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import ValidationError

from model_garden.serializers import CvatTaskSerializer
from model_garden.services.cvat import (
  CvatService, ListRequest
)


class CvatTaskViewSet(ViewSet):
  serializer_class = CvatTaskSerializer

  def list(self, request: Request):
    queryset = CvatTasksQuerySet(CvatService())
    # iterating gets single value as a string instead of a list
    queryset.filter(**{k: v for k, v in request.query_params.items()})
    queryset.order_by(request.query_params.get('ordering', 'id'))

    paginator = CvatTaskPagination()
    page = paginator.paginate_queryset(queryset, request)
    if not page:
      return Response(
        data={'message': 'Tasks was not found'},
        status=status.HTTP_404_NOT_FOUND,
      )

    serializer = CvatTaskSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)


class CvatTaskPagination(PageNumberPagination):
  page_size = 100
  page_size_query_param = 'page_size'
  max_page_size = 1000


class CvatTaskFilter(forms.Form):
  id = forms.IntegerField(required=False)
  project = forms.CharField(required=False, max_length=256)
  name = forms.CharField(required=False, max_length=256)
  mode = forms.ChoiceField(
    choices=(
      ('annotation', 'annotation'),
      ('interpolation', 'interpolation')
    ),
    required=False
  )
  status = forms.ChoiceField(
    choices=(
      ('annotation', 'annotation'),
      ('validation', 'validation'),
      ('completed', 'completed'),
    ),
    required=False
  )
  assignee = forms.CharField(required=False, max_length=256)


class CvatTasksQuerySet:
  ORDERING_FIELDS = ("id", "name", "status", "assignee",)

  def __init__(self, cvat_service: CvatService):
    self.service = cvat_service
    self.service_request = ListRequest()
    self._tasks = []

  def filter(self, **kwargs) -> 'CvatTasksQuerySet':
    filter_form = CvatTaskFilter(kwargs)
    if not filter_form.is_valid():
      raise ValidationError(
        filter_form.errors, code=status.HTTP_400_BAD_REQUEST,
      )

    self.service_request.filters.update(
      {k: v for k, v in filter_form.cleaned_data.items() if v}
    )
    return self

  def order_by(self, field_name: str) -> 'CvatTasksQuerySet':
    self.service_request.ordering = field_name
    return self

  def count(self) -> int:
    self.service_request.page = 1
    self.service_request.page_size = 1
    tasks = self.service.tasks(self.service_request)
    return tasks.count

  def __len__(self) -> int:
    return self.count()

  def __getitem__(self, key) -> Iterable[dict]:
    if not isinstance(key, (int, slice)):
        raise TypeError

    start = key.start if isinstance(key, slice) else key
    stop = key.stop if isinstance(key, slice) else key + 1
    page_size = stop - start

    if page_size == 0:
      self._tasks = []
      return self._tasks

    self.service_request.page = start // page_size + 1
    self.service_request.page_size = page_size
    self._tasks = self.service.tasks(self.service_request).results
    return self._tasks

  def __iter__(self) -> Iterator[dict]:
    """Django instatiate iterator only after slicing,
    so iterator doesn't have to make request
    """
    return iter(self._tasks)
