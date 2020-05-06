from rest_framework import serializers


class TaskSerializer(serializers.Serializer):
  task_name = serializers.CharField()
  assignee_id = serializers.IntegerField()
  bucket_id = serializers.CharField()
  bucket_path = serializers.CharField()
  files_in_task = serializers.IntegerField()
  count_of_tasks = serializers.IntegerField()
