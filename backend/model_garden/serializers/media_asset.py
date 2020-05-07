from rest_framework import serializers

from model_garden.models import MediaAsset


class MediaAssetSerializer(serializers.ModelSerializer):
  class Meta:
    model = MediaAsset
    fields = (
      'dataset',
      'filename',
      'status',
    )
