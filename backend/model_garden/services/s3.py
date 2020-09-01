import logging
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import IO, Callable, Iterator, List, NamedTuple, Tuple

from boto3 import resource
from django.conf import settings

from model_garden.constants import IMAGE_EXTENSIONS
from model_garden.utils import chunkify

logger = logging.getLogger(__name__)

DELETE_REQUEST_LIMIT = 1000


class DeleteError(NamedTuple):
  key: str
  code: str
  message: str
  version_id: str


class S3ServiceException(Exception):
  pass


class S3Client:
  def __init__(self, bucket_name: str):

    if not settings.AWS_ACCESS_KEY_ID or not settings.AWS_SECRET_KEY:
      raise S3ServiceException("AWS_ACCESS_KEY_ID and AWS_SECRET_KEY are empty. Set them in backend/model_garden/settings.py.")

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
    filter_by: Callable[['s3.ObjectSummary'], bool] = None,  # noqa: F821
  ) -> Iterator['s3.ObjectSummary']:  # noqa: F821
    summaries = self._bucket.objects.filter(Prefix=prefix)
    return (s for s in summaries if not callable(filter_by) or filter_by(s))

  def download_file(self, key: str, filename: str) -> None:
    self._bucket.meta.client.download_file(self._bucket_name, key, filename)

  def upload_file(self, filename: str, key: str) -> None:
    self._bucket.meta.client.upload_file(filename, self._bucket_name, key)

  def upload_file_obj(self, file_obj: IO, bucket: str, key: str) -> None:
    self._bucket.meta.client.upload_fileobj(file_obj, bucket, key)

  def upload_files(self, files_to_upload: Iterator[Tuple[IO, str]], bucket: str) -> None:
    with ThreadPoolExecutor() as executor:
      for future in as_completed((executor.submit(self.upload_file_obj, file_obj=file_obj, bucket=bucket, key=full_path)
                                  for file_obj, full_path in files_to_upload)):
        future.result()

  def delete_files(self, *keys: List[str]) -> List[DeleteError]:
    errors = []

    for batch in chunkify(keys, DELETE_REQUEST_LIMIT):
      logger.info('Delete in bucket %s, keys: %s', self._bucket_name, batch)

      resp = self._bucket.delete_objects(
        Delete={
          'Objects': [
            {'Key': key} for key in batch
          ],
          'Quiet': False,
        },
      )

      errors.extend([
        DeleteError(
          key=error['Key'],
          version_id=error['VersionId'],
          code=error['Code'],
          message=error['Message'],
        )
        for error in resp.get('Errors', [])
      ])

    return errors

  def delete_files_concurrent(self, *keys: List[str]) -> List[DeleteError]:
    result = []

    with ThreadPoolExecutor() as executor:
      future_to_batch = {
        executor.submit(type(self)(self._bucket_name).delete_files, *batch): batch
        for batch in chunkify(keys, DELETE_REQUEST_LIMIT)
      }

      for future in as_completed(future_to_batch):
        try:
          result.extend(future.result())
        except Exception as err:
          result.extend(
            DeleteError(key=key, version_id='', code='', message=str(err))
            for key in future_to_batch[future]
          )

    return result


def image_ext_filter(obj: 's3.ObjectSummary') -> bool:  # noqa: F821
  if not obj:
    return False

  _, ext = os.path.splitext(obj.key)
  return ext[1:] in IMAGE_EXTENSIONS
