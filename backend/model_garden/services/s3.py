from concurrent.futures import ThreadPoolExecutor, as_completed
import os.path
import logging
from typing import Callable, IO, Iterator, Tuple

from boto3 import resource
from django.conf import settings

from model_garden.constants import IMAGE_EXTENSIONS

logger = logging.getLogger(__name__)


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
    filter_by: Callable[['s3.ObjectSummary'], bool] = None,
  ) -> Iterator['s3.ObjectSummary']:
    summaries = self._bucket.objects.filter(Prefix=prefix)
    return (s for s in summaries if not callable(filter_by) or filter_by(s))

  def download_file(self, key: str, filename: str):
    self._bucket.meta.client.download_file(self._bucket_name, key, filename)

  def upload_file(self, filename: str, key: str):
    self._bucket.meta.client.upload_file(filename, self._bucket_name, key)

  def upload_file_obj(self, file_obj: IO, bucket: str, key: str):
    self._bucket.meta.client.upload_fileobj(file_obj, bucket, key)
    logger.info(f"File {key} uploaded")

  def upload_files(self, files_to_upload: Iterator[Tuple[IO, str]], bucket: str):
    with ThreadPoolExecutor() as executor:
      for future in as_completed([executor.submit(self.upload_file_obj, file_obj=file_obj, bucket=bucket, key=full_path)
                                  for file_obj, full_path in files_to_upload]):
        future.result()


def image_ext_filter(obj: 's3.ObjectSummary') -> bool:  # noqa: F821
  if not obj:
    return False

  _, ext = os.path.splitext(obj.key)
  return ext[1:] in IMAGE_EXTENSIONS
