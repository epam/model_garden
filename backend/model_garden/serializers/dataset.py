from datetime import datetime

from rest_framework import serializers

from model_garden.constants import LabelingTaskStatus
from model_garden.models import Dataset


class DatasetSerializer(serializers.ModelSerializer):
  path = serializers.CharField(
    allow_blank=True,
    allow_null=True,
    trim_whitespace=True,
  )
  items_number = serializers.SerializerMethodField()
  preview_image = serializers.SerializerMethodField()
  xmls_number = serializers.SerializerMethodField()

  class Meta:
    model = Dataset
    fields = (
      'id',
      'path',
      'bucket',
      'created_at',
      'preview_image',
      'items_number',
      'xmls_number',
    )
    validators = []

  def get_items_number(self, obj):
    return obj.media_assets.count()

  def get_preview_image(self, obj):
    return obj.media_assets.last().remote_path

  def get_xmls_number(self, obj):
    xmls_count = 0
    for media_asset_obj in obj.media_assets.all():
      if (media_asset_obj.labeling_task
              and media_asset_obj.labeling_task.status == LabelingTaskStatus.SAVED):
        xmls_count += 1

    return xmls_count

  def validate(self, attrs):
    self._validate_path(attrs)

    return super().validate(attrs=attrs)

  def _validate_path(self, attrs):
    path = attrs.get('path') or ''
    if not path:
      path = f'batch_{datetime.utcnow().date()}'

    attrs['path'] = f"/{path.strip('/')}"

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

    attrs['path'] = f"/{path.strip('/')}"
