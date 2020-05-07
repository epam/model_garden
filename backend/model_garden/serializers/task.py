from rest_framework import serializers


class TaskSerializer(serializers.Serializer):
  task_name = serializers.CharField()
  dataset_id = serializers.CharField()
  assignee_id = serializers.IntegerField()
  files_in_task = serializers.IntegerField()
  count_of_tasks = serializers.IntegerField()
