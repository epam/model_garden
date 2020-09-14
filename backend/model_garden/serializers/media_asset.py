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
  dataset_id = serializers.SerializerMethodField()
  remote_label_path = serializers.SerializerMethodField()
  labeling_task_name = serializers.SerializerMethodField()

  class Meta:
    model = MediaAsset
    fields = (
      'dataset_id',
      'filename',
      'remote_path',
      'remote_label_path',
      'labeling_task_name',
    )

  def get_dataset_id(self, obj: MediaAsset) -> str:
    return obj.dataset.id

  def get_labeling_task_name(self, obj: MediaAsset) -> str:
    if obj.labeling_task:
      return obj.labeling_task.name

  def get_remote_label_path(self, obj: MediaAsset) -> str:
    if obj.labeling_task and (obj.labeling_task.status == LabelingTaskStatus.SAVED
                              or obj.labeling_task.status == LabelingTaskStatus.ARCHIVED):
      if obj.labeling_asset_filepath:
        return obj.remote_label_path
      else:
        return None
