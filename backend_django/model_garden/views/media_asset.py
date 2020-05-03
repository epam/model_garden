from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from model_garden.models import Bucket, MediaAsset
from model_garden.serializers import DatasetSerializer, MediaAssetSerializer
from model_garden.services.s3 import S3Client


class MediaAssetViewSet(viewsets.ModelViewSet):
  queryset = MediaAsset.objects.all()
  serializer_class = MediaAssetSerializer

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
    for file in files:
      media_asset = MediaAsset(dataset=dataset, filename=file.name)
      s3_client.upload_file_obj(file_obj=file.file, bucket=bucket.name, key=media_asset.full_path)
      media_asset.save()

    return Response()
