from concurrent.futures import ThreadPoolExecutor
import io
import zipfile

from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from model_garden.models import Bucket, MediaAsset
from model_garden.serializers import DatasetSerializer, MediaAssetSerializer
from model_garden.services.s3 import S3Client


class Pagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000


class MediaAssetViewSet(viewsets.ModelViewSet):
  queryset = MediaAsset.objects.all()
  serializer_class = MediaAssetSerializer
  pagination_class = Pagination

  @action(methods=["POST"], detail=False)
  def upload(self, request):
    files = request.FILES.getlist('file', [])
    if not files:
      return Response(
        data={
          "message": "Missing files in request",
        },
        status=status.HTTP_400_BAD_REQUEST,
      )

    bucket_name = request.data.get('bucketName')
    if not bucket_name:
      return Response(
        data={
          "message": f"Missing 'bucketName' in request",
        },
        status=status.HTTP_400_BAD_REQUEST,
      )

    try:
      bucket = Bucket.objects.get(name=bucket_name)
    except Bucket.DoesNotExist:
      return Response(
        data={
          "message": f"Bucket with name='{bucket_name}' not found",
        },
        status=status.HTTP_404_NOT_FOUND,
      )

    dataset_serializer = DatasetSerializer(data={
      'path': request.data.get('path'),
      'bucket': bucket.pk,
    })
    dataset_serializer.is_valid(raise_exception=True)
    dataset = dataset_serializer.save()

    s3_client = S3Client(bucket_name=bucket.name)
    files_to_upload = []
    for file in files:
      if file.content_type == 'application/zip':
        if not zipfile.is_zipfile(file.file):
          return Response(
            data={
              "message": f"File '{file.name}' is not a zip file",
            },
            status=status.HTTP_400_BAD_REQUEST,
          )

        zip_file = zipfile.ZipFile(file.file)
        for zip_filename in zip_file.filelist:
          with zip_file.open(zip_filename) as fp:
            zip_file_obj = io.BytesIO(fp.read())
            files_to_upload.append((zip_filename.filename, zip_file_obj))
      elif 'image' in file.content_type:
        files_to_upload.append((file.name, file.file))
      else:
        continue

    with ThreadPoolExecutor(max_workers=8) as executor:
      for file_name, file_obj in files_to_upload:
        executor.submit(self._upload_file_to_s3, s3_client, dataset, file_name, file_obj)

    return Response()

  def _upload_file_to_s3(self, s3_client, dataset, file_name, file_obj):
    media_asset = MediaAsset.objects.create(dataset=dataset, filename=file_name)
    s3_client.upload_file_obj(file_obj=file_obj, bucket=dataset.bucket.name, key=media_asset.full_path)
