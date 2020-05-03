from datetime import datetime

from rest_framework import serializers

from model_garden.models import Dataset


class DatasetSerializer(serializers.ModelSerializer):
  path = serializers.CharField(allow_blank=True, allow_null=True)

  class Meta:
    model = Dataset
    fields = (
      'path',
      'bucket',
    )
    validators = []

  def validate(self, attrs):
    path = (attrs.get('path') or '').strip()
    if not path:
      path = 'batch'

    attrs['path'] = f'{path}_{datetime.utcnow().date()}'
    return super().validate(attrs=attrs)

  def create(self, validated_data):
    dataset = Dataset.objects.filter(
      path=validated_data['path'],
      bucket=validated_data['bucket'],
    ).first()
    if dataset is not None:
      return dataset

    return super().create(validated_data=validated_data)
