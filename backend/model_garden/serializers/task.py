from rest_framework import serializers


class TaskSerializer(serializers.Serializer):
  task_name = serializers.CharField()
  dataset_id = serializers.CharField()
  assignee_id = serializers.IntegerField()
  files_in_task = serializers.IntegerField()
  count_of_tasks = serializers.IntegerField()


class CvatTaskSerializer(serializers.Serializer):
  id = serializers.IntegerField()
  url = serializers.URLField()
  name = serializers.CharField()
  mode = serializers.CharField()
  size = serializers.IntegerField(required=False)
  owner = serializers.IntegerField(required=False)
  assignee = serializers.IntegerField(allow_null=True)
  created_date = serializers.DateTimeField(required=False)
  updated_date = serializers.DateTimeField(required=False)
  overlap = serializers.IntegerField(required=False)
  segment_size = serializers.IntegerField(required=False)
  z_order = serializers.BooleanField(required=False)
  status = serializers.CharField()
  labels = serializers.JSONField(required=False)
  segments = serializers.JSONField(required=False)
  image_quality = serializers.IntegerField(required=False)
  start_frame = serializers.IntegerField(required=False)
  stop_frame = serializers.IntegerField(required=False)
  frame_filter = serializers.CharField(required=False)
  project = serializers.IntegerField(required=False, allow_null=True)
