from datetime import datetime

from rest_framework import serializers

from model_garden.models import Dataset


class DatasetSerializer(serializers.ModelSerializer):
  path = serializers.CharField(
    allow_blank=True,
    allow_null=True,
    trim_whitespace=True,
  )

  class Meta:
    model = Dataset
    fields = (
      'id',
      'path',
      'bucket',
    )
    validators = []

  def validate(self, attrs):
    self._validate_path(attrs)

    return super().validate(attrs=attrs)

  def _validate_path(self, attrs):
    path = attrs.get('path') or ''
    if not path:
      path = f'batch_{datetime.utcnow().date()}'

    attrs['path'] = path.strip('/') if path.startswith('/') else path

  def create(self, validated_data):
    dataset = Dataset.objects.filter(
      path=validated_data['path'],
      bucket=validated_data['bucket'],
    ).first()
    if dataset is not None:
      return dataset

    return super().create(validated_data=validated_data)


class DatasetRawPathSerializer(DatasetSerializer):
  def _validate_path(self, attrs):
    path = attrs.get('path')
    if not path:
      raise serializers.ValidationError('Field "path" can not be empty.')
