import io
import logging
import zipfile

from django.db.utils import IntegrityError
from django_filters import rest_framework as filters
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import APIException, ParseError, ValidationError
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from model_garden.models import Bucket, MediaAsset
from model_garden.serializers import (
  DatasetSerializer, DatasetRawPathSerializer, MediaAssetSerializer
)
from model_garden.services.s3 import S3Client, image_ext_filter
from model_garden.utils import strip_s3_key_prefix

logger = logging.getLogger(__name__)


class MediaAssetFilterSet(filters.FilterSet):
  bucket_id = filters.CharFilter('dataset__bucket__id')
  dataset_id = filters.CharFilter('dataset__id')

  class Meta:
    model = MediaAsset
    fields = ('bucket_id', 'dataset_id', 'status')


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
      raise ValidationError(detail={"message": f"Missing 'bucketId' in request"})

    try:
      bucket = Bucket.objects.get(id=bucket_id)
    except Bucket.DoesNotExist:
      raise ValidationError(detail={"message": f"Bucket with id='{bucket_id}' not found"})

    return {
      'bucket': bucket,
      'files': files,
    }

  @action(methods=["POST"], detail=False)
  def upload(self, request):
    validated_attrs = self._validate_request_params(request=request)
    bucket = validated_attrs['bucket']
    files = validated_attrs['files']

    dataset_serializer = DatasetSerializer(data={
      'path': request.data.get('path'),
      'bucket': bucket.pk,
    })
    dataset_serializer.is_valid(raise_exception=True)
    dataset = dataset_serializer.save()

    media_assets_to_upload = []
    for file in files:
      filename = None
      file_obj = None
      if file.content_type == 'application/zip':
        if not zipfile.is_zipfile(file.file):
          raise ParseError(detail={"message": f"File '{file.name}' is not a zip file"})

        zip_file = zipfile.ZipFile(file.file)
        for zip_filename in zip_file.filelist:
          with zip_file.open(zip_filename) as fp:
            filename = zip_filename.filename
            file_obj = io.BytesIO(fp.read())
      elif 'image' in file.content_type:
        filename = file.name
        file_obj = file.file
      else:
        logger.warning(f"Got unexpected file content type: {file.content_type}")
        continue

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
    except Exception as e:
      logger.error(f"Failed to upload file to s3: {e}")
      raise APIException(
        detail={
          'message': str(e),
        },
      )

  @action(methods=["POST"], detail=False, url_path='import-s3')
  def import_s3(self, request):
    dataset_serializer = DatasetRawPathSerializer(data={
      'bucket': request.data.get('bucketId'),
      'path': request.data.get('path'),
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
    MediaAsset.objects.bulk_create(
      assets, batch_size=100, ignore_conflicts=True
    )

    return Response(data={'imported': len(assets)}, status=status.HTTP_200_OK)
