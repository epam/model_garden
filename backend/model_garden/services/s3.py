import os.path
from typing import IO, Iterator, Callable

from boto3 import resource
from django.conf import settings

from model_garden.constants import IMAGE_EXTENSIONS


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

  def list_keys(
    self,
    prefix: str,
    filter_by: Callable[['s3.ObjectSummary'], bool] = None
  ) -> Iterator['s3.ObjectSummary']:
    summaries = self._bucket.objects.filter(Prefix=prefix)
    return (s for s in summaries if not callable(filter_by) or filter_by(s))

  def download_file(self, key: str, filename: str):
    self._bucket.meta.client.download_file(self._bucket_name, key, filename)

  def upload_file(self, filename: str, key: str):
    self._bucket.meta.client.upload_file(filename, self._bucket_name, key)

  def upload_file_obj(self, file_obj: IO, bucket: str, key: str):
    self._bucket.meta.client.upload_fileobj(file_obj, bucket, key)


def image_ext_filter(obj: 's3.ObjectSummary') -> bool:  # noqa: F821
  if not obj:
    return False

  _, ext = os.path.splitext(obj.key)
  return ext[1:] in IMAGE_EXTENSIONS
