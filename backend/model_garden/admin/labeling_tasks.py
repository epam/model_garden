from django.contrib import admin

from model_garden.constants import LabelingTaskStatus
from model_garden.models import LabelingTask

from .common import FilterCreatedFixture, format_date


@admin.register(LabelingTask)
class LabelingTaskAdmin(admin.ModelAdmin, FilterCreatedFixture):
  date_hierarchy = 'created_at'
  list_display = ('id', 'created', 'status', 'name', 'url', 'labeler', 'task_id')
  list_filter = ('created_at', 'status', 'labeler')
  search_fields = ('id', 'task_id', 'name')
  readonly_fields = ('status',)

  def has_add_permission(self, request, obj=None):
    return False

  @staticmethod
  def get_protected_by_status(objs):
    return list(map(
      lambda obj: 'The task with task_id={.task_id} must be in status ARCHIVED.'.format(obj),
      (obj for obj in objs if obj.status != LabelingTaskStatus.ARCHIVED),
    ))

  def get_deleted_objects(self, objs, request):
    deleted_objects, model_count, perms_needed, protected = (
      super().get_deleted_objects(objs, request)
    )

    protected.extend(self.get_protected_by_status(objs))

    return deleted_objects, model_count, perms_needed, protected

  def created(self, obj):
    return format_date(obj.created_at)

  def get_search_results(self, request, queryset, search_term):
    queryset, use_distinct = super().get_search_results(request, queryset, search_term)

    queryset |= self.filter_created(request, queryset, search_term)

    return queryset, use_distinct
