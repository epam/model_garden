import logging
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from io import BytesIO
from zipfile import ZipFile
from typing import List

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone

from model_garden.constants import LabelingTaskStatus
from model_garden.models import LabelingTask
from model_garden.services import CvatService, S3Client

logger = logging.getLogger(__name__)


class Command(BaseCommand):
  help = "Process tasks statuses"

  def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)
    self._cvat_service = CvatService()

  def handle(self, *args, **kwargs):
    try:
      labeling_tasks = list(
        LabelingTask.objects
        .filter(
          status__in=(
            LabelingTaskStatus.ANNOTATION,
            LabelingTaskStatus.VALIDATION,
            LabelingTaskStatus.COMPLETED,
          ))
        .order_by("updated_at")
        [:settings.TASK_STATUSES_WORKER_CHUNK_SIZE],
      )

      if labeling_tasks:
        self._process_labeling_tasks(labeling_tasks=labeling_tasks)
      else:
        logger.info("No pending labeling tasks found")

    except Exception as e:
      raise CommandError(f"Failed to process labeling tasks: {e}")

  def _process_labeling_tasks(self, labeling_tasks: List[LabelingTask]):
    logger.info(f"Processing {len(labeling_tasks)} labeling tasks")

    # NOTE: Make sure we get the "oldest" tasks every time, so we need to update
    # updated_at to the current time for the current chunk.
    LabelingTask.objects.filter(pk__in=[task.pk for task in labeling_tasks]).update(updated_at=timezone.now())

    # update labeling tasks statuses
    labeling_tasks_to_upload = []
    for labeling_task, cvat_task in self._get_cvat_statuses(labeling_tasks=labeling_tasks):
      if labeling_task.status in (LabelingTaskStatus.ANNOTATION, LabelingTaskStatus.VALIDATION):
        cvat_task_status = cvat_task.get('status')
        if cvat_task_status is not None and labeling_task.status != cvat_task_status:
          labeling_task.status = cvat_task_status
          labeling_task.save(update_fields=('status', 'updated_at'))

      if labeling_task.status == LabelingTaskStatus.COMPLETED:
        labeling_tasks_to_upload.append(labeling_task)

    # upload annotations
    logger.info(f"Uploading annotations for {len(labeling_tasks_to_upload)} labeling tasks")
    with ThreadPoolExecutor() as executor:
      for labeling_task in executor.map(self._upload_labeling_task_annotations, labeling_tasks_to_upload):
        labeling_task.status = LabelingTaskStatus.SAVED
        labeling_task.save(update_fields=('status', 'updated_at'))

  def _get_cvat_statuses(self, labeling_tasks):
    with ThreadPoolExecutor() as executor:
      future_to_labeling_task = {executor.submit(self._cvat_service.get_task, t.task_id): t for t in labeling_tasks}
      for future in as_completed(future_to_labeling_task):
        labeling_task = future_to_labeling_task[future]
        try:
          cvat_task = future.result()
        except Exception as e:
          raise Exception(f"Failed to process {labeling_task}: {e}")
        else:
          yield labeling_task, cvat_task

  def _upload_labeling_task_annotations(self, labeling_task: LabelingTask):
    try:
      annotations_content_zip = self._cvat_service.get_annotations(
        task_id=labeling_task.task_id,
        task_name=labeling_task.name,
      )
    except Exception as e:
      raise Exception(f"Failed to get annotations for task with pk={labeling_task.pk}: {e}")

    zip_fp = BytesIO(annotations_content_zip)
    zf = ZipFile(file=zip_fp)
    annotation_filenames = {}
    for zip_info in zf.filelist:
      if zip_info.filename.startswith('Annotations'):
        annotation_filename, _ = os.path.splitext(os.path.split(zip_info.filename)[-1])
        annotation_filenames[annotation_filename] = zf.open(zip_info)

    for media_asset in labeling_task.media_assets.all():
      try:
        asset_filename, _ = os.path.splitext(media_asset.filename)
        if asset_filename in annotation_filenames:
          bucket_name = media_asset.dataset.bucket.name
          annotation_full_path = f"{media_asset.full_path}.xml"
          s3_client = S3Client(bucket_name=bucket_name)
          s3_client.upload_file_obj(
            file_obj=annotation_filenames[asset_filename],
            bucket=bucket_name,
            key=annotation_full_path,
          )
          logger.info(f"Uploaded annotation '{annotation_full_path}'")
        else:
          raise Exception(f"Annotation file not found: '{asset_filename}'")
      except Exception as e:
        logger.error(f"Failed to process annotation: {e}")

    return labeling_task
