import tempfile
from unittest import mock

from django.core import management

from model_garden.constants import LabelingTaskStatus, AnnotationsFormat
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

  def tearDown(self):
    self.s3_client_patcher.stop()
    self.cvat_service_patcher.stop()
    super().tearDown()

  def test_handle(self):
    media_asset = self.test_factory.create_media_asset(filename='test.jpg', assigned=True)
    self.cvat_service_mock.get_annotations.return_value = self.test_zip_file_factory.get_zip_file_content(
      ('Annotations/test.xml', 'test'),
    )
    labeling_task = media_asset.labeling_task

    management.call_command('process_task_statuses')

    self.cvat_service_mock.get_annotations.assert_called_once_with(
      task_id=labeling_task.task_id,
      task_name=labeling_task.name,
      annotation_format=AnnotationsFormat.PASCAL_VOB_ZIP_1_1,
    )
    self.s3_client_mock.upload_file_obj.assert_called_once_with(
      file_obj=mock.ANY,
      bucket=media_asset.dataset.bucket.name,
      key='test_path/test.jpg.xml',
    )
    labeling_task.refresh_from_db()
    self.assertEqual(labeling_task.status, LabelingTaskStatus.SAVED)

  @mock.patch("model_garden.management.commands.process_task_statuses.Command._process_labeling_tasks")
  def test_handle_raises(self, process_labeling_tasks_mock):
    self.test_factory.create_media_asset(assigned=True)

    process_labeling_tasks_mock.side_effect = Exception("command error")

    with self.assertRaisesRegex(Exception, "Failed to process labeling tasks: command error"):
      management.call_command('process_task_statuses')

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
    self.cvat_service_mock.get_annotations.return_value = self.test_zip_file_factory.get_zip_file_content(
      ('Annotations/test.xml', 'test'),
    )
    self.s3_client_mock.upload_file_obj.side_effect = Exception('S3 error')
    media_asset = self.test_factory.create_media_asset(filename='test.jpg', assigned=True)
    labeling_task = media_asset.labeling_task

    management.call_command('process_task_statuses')

    labeling_task.refresh_from_db()
    self.assertEqual(labeling_task.error, "Failed to upload task annotations: S3 error")

  def test_handle_missing_one_annotation_filename(self):
    self.cvat_service_mock.get_annotations.return_value = self.test_zip_file_factory.get_zip_file_content(
      ('Annotations/test.xml', 'test'),
    )
    media_asset = self.test_factory.create_media_asset(filename='test.jpg', assigned=True)
    media_asset2 = self.test_factory.create_media_asset(filename='test2.jpg', assigned=True)
    labeling_task = media_asset.labeling_task
    labeling_task2 = media_asset2.labeling_task

    management.call_command('process_task_statuses')

    labeling_task.refresh_from_db()
    labeling_task2.refresh_from_db()

    self.assertEqual(labeling_task.error, None)
    self.assertEqual(labeling_task2.error, None)

  @mock.patch('model_garden.management.commands.process_task_statuses.logger')
  def test_handle_no_pending_labeling_tasks(self, logger_mock):
    management.call_command('process_task_statuses')

    logger_mock.info.assert_called_once_with('No pending labeling tasks found')

  def test_handle_missing_all_annotation_filenames(self):
    with tempfile.NamedTemporaryFile(mode="w+b", delete=True) as temporaryFile:
        self.cvat_service_mock.get_annotations.return_value = (
          self.test_zip_file_factory.get_empty_zip_file_content(temporaryFile, ["annotations/"]))

    media_asset = self.test_factory.create_media_asset(filename='test.jpg', assigned=True)
    labeling_task = media_asset.labeling_task

    management.call_command('process_task_statuses')
    labeling_task.refresh_from_db()
    self.assertIn("Missing all task annotations for task :1", labeling_task.error)
