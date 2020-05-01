from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response

from model_garden.models import Bucket, MediaAsset
from model_garden.serializers import MediaAssetSerializer, BucketItemSerializer


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

    bucket_item_serializer = BucketItemSerializer(data={
      'path': request.data.get('path'),
      'bucket': bucket.pk,
    })
    bucket_item_serializer.is_valid(raise_exception=True)
    bucket_item = bucket_item_serializer.save()

    MediaAsset.objects.bulk_create([
      MediaAsset(bucket_item=bucket_item, filename=file)
      for file in files
    ])

    return Response()
