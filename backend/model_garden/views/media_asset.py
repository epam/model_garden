from collections import defaultdict
import io
import logging
import zipfile

import botocore.exceptions
from django.db.utils import IntegrityError
from django_filters import rest_framework as filters
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import APIException, ParseError, ValidationError
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from model_garden.constants import DATASET_FORMATS
from model_garden.models import Bucket, MediaAsset
from model_garden.serializers import (
  DatasetRawPathSerializer,
  DatasetSerializer,
  MediaAssetSerializer,
  MediaAssetIDSerializer,
)
from model_garden.services.s3 import S3Client, image_ext_filter, S3ServiceException
from model_garden.utils import strip_s3_key_prefix

logger = logging.getLogger(__name__)


class MediaAssetFilterSet(filters.FilterSet):
  bucket_id = filters.CharFilter('dataset__bucket__id')
  dataset_id = filters.CharFilter('dataset__id')
  is_pending = filters.BooleanFilter('labeling_task', lookup_expr='isnull')

  class Meta:
    model = MediaAsset
    fields = ('bucket_id', 'dataset_id', 'is_pending')


class MediaAssetPagination(PageNumberPagination):
  page_size = 100
  page_size_query_param = 'page_size'
  max_page_size = 1000


class MediaAssetViewSet(viewsets.ModelViewSet):
  queryset = MediaAsset.objects.all()
  serializer_class = MediaAssetSerializer
  filterset_class = MediaAssetFilterSet
  pagination_class = MediaAssetPagination

  @staticmethod
  def _validate_request_params(request):
    files = request.FILES.getlist('file', [])
    if not files:
      raise ValidationError(detail={"message": "Missing files in request"})

    bucket_id = request.data.get('bucketId')
    if not bucket_id:
      raise ValidationError(detail={"message": "Missing 'bucketId' in request"})

    try:
      bucket = Bucket.objects.get(id=bucket_id)
    except Bucket.DoesNotExist:
      raise ValidationError(detail={"message": f"Bucket with id='{bucket_id}' not found"})

    dataset_format = request.data.get('dataset_format')
    if not dataset_format or dataset_format not in DATASET_FORMATS:
      raise ValidationError(detail={"message": "Missing 'dataset_format' in request."})

    return {
      'bucket': bucket,
      'files': files,
      'dataset_format': dataset_format,
    }

  @action(methods=["POST"], detail=False)
  def upload(self, request):
    validated_attrs = self._validate_request_params(request=request)
    bucket = validated_attrs['bucket']
    files = validated_attrs['files']
    dataset_format = validated_attrs['dataset_format']

    dataset_serializer = DatasetSerializer(data={
      'path': request.data.get('path'),
      'bucket': bucket.pk,
      'dataset_format': dataset_format,
    })
    dataset_serializer.is_valid(raise_exception=True)
    dataset = dataset_serializer.save()

    files_to_upload = []
    for file in files:
      if file.content_type in ('application/zip', 'application/x-zip-compressed'):
        if not zipfile.is_zipfile(file.file):
          raise ParseError(detail={"message": f"File '{file.name}' is not a zip file"})

        zip_file = zipfile.ZipFile(file.file)
        for zip_filename in zip_file.filelist:
          if zip_filename.filename.endswith('/'):
            continue
          with zip_file.open(zip_filename) as fp:
            files_to_upload.append((zip_filename.filename, io.BytesIO(fp.read())))
      elif 'image' in file.content_type:
        files_to_upload.append((file.name, file.file))
      else:
        logger.warning(f"Got unexpected file content type: {file.content_type}")
        continue

    media_assets_to_upload = []
    for filename, file_obj in files_to_upload:
      try:
        media_asset = MediaAsset.objects.create(dataset=dataset, filename=filename)
      except IntegrityError as e:
        logger.error(f"Failed to create media asset: {e}")
        raise ParseError(
          detail={'message': f"Media asset for dataset='{dataset.path}' and filename='{filename}' already exists"},
        )
      else:
        media_assets_to_upload.append((media_asset, file_obj))

    self._upload_media_assets_to_s3(
      bucket_name=bucket.name,
      media_assets_to_upload=media_assets_to_upload,
    )

    return Response(data={'message': f"{len(media_assets_to_upload)} media asset(s) uploaded"})

  def _upload_media_assets_to_s3(self, bucket_name: str, media_assets_to_upload) -> None:
    try:
      S3Client(bucket_name=bucket_name).upload_files(
        files_to_upload=((file_obj, media_asset.full_path) for media_asset, file_obj in media_assets_to_upload),
        bucket=bucket_name,
      )
    except botocore.exceptions.NoCredentialsError as s3_credential_exception:
      logger.error(f"Missing aws s3 credentials: {s3_credential_exception}")
      raise S3ServiceException(
        "AWS_ACCESS_KEY_ID and AWS_SECRET_KEY are empty.Set them in backend/model_garden/settings.py.",
      )
    except Exception as s3_exception:
      logger.error(f"Failed to upload file to s3: {s3_exception}")
      raise APIException(
        detail={
          'message': str(s3_exception),
        },
      )

  @action(methods=["POST"], detail=False, url_path='import-s3')
  def import_s3(self, request):
    dataset_serializer = DatasetRawPathSerializer(data={
      'bucket': request.data.get('bucketId'),
      'path': request.data.get('path'),
      'dataset_format': request.data.get('dataset_format'),
    })
    dataset_serializer.is_valid(raise_exception=True)
    dataset = dataset_serializer.save()

    s3_client = S3Client(bucket_name=dataset.bucket.name)

    assets = [
      MediaAsset(
        dataset=dataset,
        filename=strip_s3_key_prefix(dataset.path, asset.key),
      )
      for asset in s3_client.list_keys(dataset.path, filter_by=image_ext_filter)
    ]

    assets_before = MediaAsset.objects.filter(dataset=dataset).count()

    MediaAsset.objects.bulk_create(
      assets,
      batch_size=100,
      ignore_conflicts=True,
    )

    assets_after = MediaAsset.objects.filter(dataset=dataset).count()

    return Response(
      data={'imported': assets_after - assets_before},
      status=status.HTTP_200_OK,
    )

  @action(methods=["POST"], detail=False)
  def delete(self, request):
    """Creates a POST request with list of asset ids to delete from s3.
    Request::
        {"id": [id1, id2]}

    Response::
        {HTTP_400_BAD_REQUEST} if id doesn't exist in db
        {HTTP_200_OK} for successful deletion
    """
    media_asset_serializer = MediaAssetIDSerializer(data=request.data)
    media_asset_serializer.is_valid(raise_exception=True)
    media_assets_to_delete = MediaAsset.objects.filter(
      pk__in=media_asset_serializer.data['id'],
    )

    # Check if requested list of media asset ids present in db.
    if len(media_assets_to_delete) != len(media_asset_serializer.data['id']):
      return Response(
        data={'message': "Media assets with such ids don't exist."},
        status=status.HTTP_400_BAD_REQUEST,
      )

    bucket_map = defaultdict(list)

    # Map list of media assets to particular bucket.
    for asset in media_assets_to_delete:
      bucket_map[asset.dataset.bucket.name].append(asset)

    # Delete media assets from each bucket.
    for bucket, assets in bucket_map.items():
      self._delete_media_assets_from_s3(
        bucket, [asset.full_path for asset in assets],
      )
    media_assets_to_delete.delete()

    return Response(
      status=status.HTTP_200_OK,
    )

  def _delete_media_assets_from_s3(self, bucket_name: str, assets_to_delete) -> None:
    try:
      S3Client(bucket_name=bucket_name).delete_files_concurrent(
        bucket_name,
        assets_to_delete,
      )
    except Exception as s3_exception:
      logger.error(f"Failed to delete files from s3: {s3_exception}")
      raise APIException(detail={'message': str(s3_exception)})
