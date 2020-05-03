from datetime import datetime

from rest_framework import serializers

from model_garden.models import BucketItem


class BucketItemSerializer(serializers.ModelSerializer):
  path = serializers.CharField(allow_blank=True, allow_null=True)

  class Meta:
    model = BucketItem
    fields = (
      'path',
      'bucket',
    )
    validators = []

  def validate(self, attrs):
    path = attrs.get('path')
    if path is None:
      path = ''

    path = path.strip()
    if not path:
      attrs['path'] = f'batch_{datetime.utcnow().date()}'
    return super().validate(attrs=attrs)

  def create(self, validated_data):
    bucket_item = BucketItem.objects.filter(
      path=validated_data['path'],
      bucket=validated_data['bucket'],
    ).first()
    if bucket_item is not None:
      return bucket_item

    return super().create(validated_data=validated_data)
