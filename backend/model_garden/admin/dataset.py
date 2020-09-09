import logging
from collections import defaultdict
from typing import List, Set, Tuple

from django.contrib import admin
from django.db.models import QuerySet

from model_garden.models import Dataset, MediaAsset
from model_garden.services import S3Client
from model_garden.services.s3 import DeleteError

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
    media_assets = list(get_media_assets(queryset))

    bucket_map = defaultdict(list)
    for asset in media_assets:
      bucket_map[asset.dataset.bucket.name].append(asset)

    error_keys: Set[Tuple(str, str)] = set()
    for bucket, assets in bucket_map.items():
      file_path_to_remove = ([asset.full_path for asset in assets]
                             + [asset.full_label_path for asset in assets])
      delete_errors = delete_files_in_s3(
        bucket, file_path_to_remove,
      )
      error_keys |= set((bucket, error.key) for error in delete_errors)

    (
      MediaAsset.objects
      .filter(
        pk__in=[
          asset.pk for asset in media_assets
          if (asset.dataset.bucket.name, asset.full_path) not in error_keys
        ],
      ).delete()
    )
    (
      queryset
      .exclude(
        pk__in=set(
          asset.dataset.pk for asset in media_assets
          if (asset.dataset.bucket.name, asset.full_path) in error_keys
        ),
      )
      .delete()
    )


def get_media_assets(dataset: QuerySet) -> QuerySet:
  return (
    MediaAsset.objects
    .filter(dataset__in=dataset)
    .select_related('dataset')
    .select_related('dataset__bucket')
  )


def delete_files_in_s3(bucket: str, keys: List[str]) -> List[DeleteError]:
  if not keys:
    return []

  client = S3Client(bucket_name=bucket)

  errors = client.delete_files_concurrent(*keys)

  if errors:
    logger.error(
      'Unable to delete media_assets in bucket %s: %s', bucket, errors,
    )

  return errors
