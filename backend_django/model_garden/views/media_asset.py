from rest_framework import viewsets

from model_garden.models import MediaAsset
from model_garden.serializers import MediaAssetSerializer


class MediaAssetViewSet(viewsets.ModelViewSet):
  queryset = MediaAsset.objects.all()
  serializer_class = MediaAssetSerializer
