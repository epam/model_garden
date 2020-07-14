from rest_framework import serializers

from model_garden.models import MediaAsset


class MediaAssetSerializer(serializers.ModelSerializer):
  remote_xml_path = serializers.SerializerMethodField()

  class Meta:
    model = MediaAsset
    fields = (
      'dataset',
      'filename',
      'remote_path',
      'remote_xml_path',
    )

  def get_remote_xml_path(self, obj: MediaAsset) -> str:
    if obj.labeling_task:
      return obj.remote_xml_path
