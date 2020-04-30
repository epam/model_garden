from django.conf import settings
from boto3 import resource


class S3Client:
    def __init__(self, bucket_name: str):
        self._s3 = resource(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_KEY,
        )
        self._bucket_name = bucket_name
        self._bucket = self._s3.Bucket(bucket_name)

    def list_bucket(self):
        return list(self._bucket.objects.all())

    def download_file(self, key: str, filename: str):
        self._bucket.meta.client.download_file(self._bucket_name, key, filename)

    def upload_file(self, filename: str, key: str):
        self._bucket.meta.client.upload_file(filename, self._bucket_name, key)
