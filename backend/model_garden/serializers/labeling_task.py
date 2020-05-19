from rest_framework import serializers

from model_garden.models import Labeler, LabelingTask


class LabelingTaskCreateSerializer(serializers.Serializer):
  task_name = serializers.CharField()
  dataset_id = serializers.CharField()
  assignee_id = serializers.IntegerField()
  files_in_task = serializers.IntegerField()
  count_of_tasks = serializers.IntegerField()


class LabelingTaskSerializer(serializers.ModelSerializer):
  labeler = serializers.SerializerMethodField()

  class Meta:
    model = LabelingTask
    fields = (
      'labeler',
      'name',
      'status',
    )

  def get_labeler(self, obj: Labeler) -> str:
    return obj.labeler.username
