from rest_framework import serializers

from model_garden.constants import LabelingTaskStatus
from model_garden.models import MediaAsset


class MediaAssetIDSerializer(serializers.Serializer):
  id = serializers.ListField(
    child=serializers.IntegerField(),
    required=True,
    allow_empty=False,
    min_length=1,
  )


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
    if obj.labeling_task and (obj.labeling_task.status == LabelingTaskStatus.SAVED
                              or obj.labeling_task.status == LabelingTaskStatus.ARCHIVED):
      return obj.remote_xml_path
