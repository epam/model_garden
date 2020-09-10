from rest_framework import serializers

from model_garden.models import Labeler, LabelingTask


class LabelingTaskCreateSerializer(serializers.Serializer):
  task_name = serializers.CharField()
  dataset_id = serializers.CharField()
  assignee_id = serializers.IntegerField()
  files_in_task = serializers.IntegerField()
  count_of_tasks = serializers.IntegerField()


class LabelingTaskSerializer(serializers.ModelSerializer):
  dataset = serializers.SerializerMethodField()
  labeler = serializers.SerializerMethodField()
  dataset_id = serializers.SerializerMethodField()
  class Meta:
    model = LabelingTask
    fields = (
      'id',
      'dataset_id',
      'dataset',
      'labeler',
      'name',
      'status',
      'url',
      'error',
    )
    read_only_fields = fields

  def get_dataset(self, obj: Labeler) -> str:
    media_asset = obj.media_assets.first()
    if media_asset is not None:
      return media_asset.dataset.path

  def get_labeler(self, obj: Labeler) -> str:
    return obj.labeler.username

  def get_dataset_id(self, obj: Labeler) -> str:
    media_asset = obj.media_assets.first()
    if media_asset is not None:
      return media_asset.dataset.id


class LabelingTaskIDSerializer(serializers.Serializer):
  id = serializers.ListField(
    child=serializers.IntegerField(),
    required=True,
    allow_empty=False,
    min_length=1,
  )
