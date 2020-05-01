from rest_framework import serializers

from model_garden.models import BucketItem


class BucketItemSerializer(serializers.ModelSerializer):
  class Meta:
    model = BucketItem
    fields = (
      'path',
      'bucket',
    )
