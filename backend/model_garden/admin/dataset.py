from django.contrib import admin

from model_garden.models import Dataset
from .common import FilterCreatedFixture, format_date


@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin, FilterCreatedFixture):
  date_hierarchy = 'created_at'
  list_display = ('id', 'created', 'path', 'bucket')
  list_filter = ('created_at', 'bucket')
  search_fields = ('id', 'path')

  def has_add_permission(self, request, obj=None):
    return False

  def created(self, obj):
    return format_date(obj.created_at)

  def get_search_results(self, request, queryset, search_term):
    queryset, use_distinct = super().get_search_results(request, queryset, search_term)

    queryset |= self.filter_created(request, queryset, search_term)

    return queryset, use_distinct
