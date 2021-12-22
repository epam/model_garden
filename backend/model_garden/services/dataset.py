import logging
from collections import defaultdict
from typing import List, Set, Tuple

from django.db.models import QuerySet

from model_garden.models import MediaAsset

from model_garden.services import S3Client
from model_garden.services.s3 import DeleteError

logger = logging.getLogger(__name__)


class DatasetService:

  def delete_media_assets_by_dataset(self, media_assets):
      dataset_service = DatasetService()
      bucket_map = defaultdict(list)
      for asset in media_assets:
          bucket_map[asset.dataset.bucket.name].append(asset)

      error_keys: Set[Tuple[str, str]] = set()
      for bucket, assets in bucket_map.items():
          file_path_to_remove = ([asset.full_path for asset in assets]
                                 + [asset.full_label_path for asset in assets])
          delete_errors = dataset_service.delete_files_in_s3(
              bucket, file_path_to_remove,
          )
          error_keys |= set((bucket, error.key) for error in delete_errors)

      (
          MediaAsset.objects.filter(
              pk__in=[
                  asset.pk for asset in media_assets
                  if (asset.dataset.bucket.name, asset.full_path) not in error_keys
              ],
          ).delete()
      )
      (
          media_assets.exclude(
              pk__in=set(asset.dataset.pk for asset in media_assets
                         if (asset.dataset.bucket.name, asset.full_path) in error_keys
                         ),
          ).delete()
      )

  def delete_files_in_s3(self, bucket: str, keys: List[str]) -> List[DeleteError]:
    if not keys:
        return []

    client = S3Client(bucket_name=bucket)

    errors = client.delete_files_concurrent(*keys)

    if errors:
        logger.error(
            'Unable to delete media_assets in bucket %s: %s', bucket, errors,
        )

    return errors

  def get_media_assets(self, dataset: QuerySet) -> QuerySet:
    return (
        MediaAsset.objects
        .filter(dataset__in=dataset)
        .select_related('dataset')
        .select_related('dataset__bucket')
    )
