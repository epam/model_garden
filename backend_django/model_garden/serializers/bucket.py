from rest_framework import serializers

from model_garden.models import Bucket


class BucketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bucket
        fields = (
            'name',
        )
