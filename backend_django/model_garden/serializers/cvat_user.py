from rest_framework import serializers


class CvatUserSerializer(serializers.Serializer):
  id = serializers.IntegerField(read_only=True)
  email = serializers.CharField(read_only=True)
  full_name = serializers.SerializerMethodField(read_only=True)

  def get_full_name(self, obj):
    return f"{obj['first_name']} {obj['last_name']}"
