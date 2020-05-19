from rest_framework import serializers

from model_garden.models import Labeler, LabelingTask


class LabelingTaskCreateSerializer(serializers.Serializer):
  task_name = serializers.CharField()
  dataset_id = serializers.CharField()
  assignee_id = serializers.IntegerField()
  files_in_task = serializers.IntegerField()
  count_of_tasks = serializers.IntegerField()


class LabelingTaskSerializer(serializers.ModelSerializer):
  dataset = serializers.SerializerMethodField(read_only=True)
  labeler = serializers.SerializerMethodField(read_only=True)

  class Meta:
    model = LabelingTask
    fields = (
      'dataset',
      'labeler',
      'name',
      'status',
    )

  def get_dataset(self, obj: Labeler) -> str:
    media_asset = obj.media_assets.first()
    if media_asset is not None:
      return f"/{media_asset.dataset.path}"

  def get_labeler(self, obj: Labeler) -> str:
    return obj.labeler.username
