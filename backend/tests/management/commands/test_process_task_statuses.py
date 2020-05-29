from unittest import mock

from django.core import management

from model_garden.constants import LabelingTaskStatus
from tests import BaseTransactionTestCase


class TestCommand(BaseTransactionTestCase):
  def setUp(self):
    super().setUp()
    self.cvat_service_patcher = mock.patch('model_garden.management.commands.process_task_statuses.CvatService')
    self.cvat_service_mock = self.cvat_service_patcher.start().return_value
    self.cvat_service_mock.get_task.return_value = {
      'status': LabelingTaskStatus.COMPLETED,
    }
    self.s3_client_patcher = mock.patch('model_garden.management.commands.process_task_statuses.S3Client')
    self.s3_client_mock = self.s3_client_patcher.start().return_value
    self.cvat_service_mock.get_annotations.return_value = self.test_factory.get_zip_file(
      ('Annotations/test.xml', 'test'),
    )

  def tearDown(self):
    self.s3_client_patcher.stop()
    self.cvat_service_patcher.stop()
    super().tearDown()

  def test_handle(self):
    labeling_task = self.test_factory.create_labeling_task()
    media_asset = self.test_factory.create_media_asset(filename='test.jpg')
    media_asset.labeling_task = labeling_task
    media_asset.save(update_fields=('labeling_task',))

    management.call_command('process_task_statuses')

    self.cvat_service_mock.get_annotations.assert_called_once_with(
      task_id=labeling_task.task_id,
      task_name=labeling_task.name,
    )
    self.s3_client_mock.upload_file_obj.assert_called_once_with(
      file_obj=mock.ANY,
      bucket=media_asset.dataset.bucket.name,
      key='test_path/test.jpg.xml',
    )
    labeling_task.refresh_from_db()
    self.assertEqual(labeling_task.status, LabelingTaskStatus.SAVED)

  def test_handle_get_task_error(self):
    self.cvat_service_mock.get_task.side_effect = Exception('CVAT error')
    media_asset = self.test_factory.create_media_asset(assigned=True)
    labeling_task = media_asset.labeling_task

    management.call_command('process_task_statuses')

    labeling_task.refresh_from_db()
    self.assertEqual(labeling_task.error, "Failed to get task status: CVAT error")

  def test_handle_get_annotations_error(self):
    self.cvat_service_mock.get_annotations.side_effect = Exception('CVAT error')
    media_asset = self.test_factory.create_media_asset(assigned=True)
    labeling_task = media_asset.labeling_task

    management.call_command('process_task_statuses')

    labeling_task.refresh_from_db()
    self.assertEqual(labeling_task.error, "Failed to get task annotations: CVAT error")

  def test_handle_s3_upload_error(self):
    self.s3_client_mock.upload_file_obj.side_effect = Exception('S3 error')
    media_asset = self.test_factory.create_media_asset(filename='test.jpg', assigned=True)
    labeling_task = media_asset.labeling_task

    management.call_command('process_task_statuses')

    labeling_task.refresh_from_db()
    self.assertEqual(labeling_task.error, "Failed to upload task annotations: S3 error")

  @mock.patch('model_garden.management.commands.process_task_statuses.logger')
  def test_handle_no_pending_labeling_tasks(self, logger_mock):
    management.call_command('process_task_statuses')

    logger_mock.info.assert_called_once_with('No pending labeling tasks found')
