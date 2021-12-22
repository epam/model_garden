import logging

from django.contrib import admin

from model_garden.models import Dataset
from model_garden.services import DatasetService

from .common import FilterCreatedFixture, format_date

logger = logging.getLogger(__name__)


@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin, FilterCreatedFixture):
  date_hierarchy = 'created_at'
  list_display = ('id', 'created', 'path', 'bucket', 'dataset_format')
  list_filter = ('created_at', 'bucket', 'dataset_format')
  search_fields = ('id', 'path')

  def has_add_permission(self, request, obj=None):
    return False

  def created(self, obj):
    return format_date(obj.created_at)

  def get_search_results(self, request, queryset, search_term):
    queryset, use_distinct = super().get_search_results(request, queryset, search_term)

    queryset |= self.filter_created(request, queryset, search_term)

    return queryset, use_distinct

  def delete_model(self, request, obj):
    queryset = type(obj).objects.filter(pk=obj.pk)
    self.delete_queryset(request, queryset)

  def delete_queryset(self, request, queryset):
    dataset_service = DatasetService()
    media_assets = dataset_service.get_media_assets(queryset)
    dataset = media_assets.first().dataset
    dataset_service.delete_media_assets_by_dataset(media_assets)
    dataset.delete()
