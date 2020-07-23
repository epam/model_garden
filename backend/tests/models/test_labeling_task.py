from model_garden.constants import LabelingTaskStatus
from model_garden.models import LabelingTask
from tests import BaseTestCase


class TestLabelingTask(BaseTestCase):
  def test_create(self):
    labeling_task = self.test_factory.create_labeling_task(name='Test labeling task')

    self.assertEqual(labeling_task.name, 'Test labeling task')
    self.assertEqual(labeling_task.status, LabelingTaskStatus.ANNOTATION)

  def test_str(self):
    labeling_task = self.test_factory.create_labeling_task(name='Test labeling task')

    self.assertEqual(
      str(labeling_task),
      "LabelingTask(task_id=1, name='Test labeling task', status='annotation', labeler='test_labeler_1')",
    )

  def test_fetch_for_archiving_excludes_archived(self):
    annotated = self.test_factory.create_labeling_task(status=LabelingTaskStatus.ANNOTATION)
    completed = self.test_factory.create_labeling_task(status=LabelingTaskStatus.COMPLETED)
    archived = self.test_factory.create_labeling_task(status=LabelingTaskStatus.ARCHIVED)

    tasks = LabelingTask.fetch_for_archiving(pk__in=[annotated.id, completed.id, archived.id])

    self.assertSetEqual(
      {t.id for t in tasks},
      {annotated.id, completed.id},
    )

  def test_update_status(self):
    labeling_task = self.test_factory.create_labeling_task()

    labeling_task.update_status(status=LabelingTaskStatus.COMPLETED)

    labeling_task.refresh_from_db()
    self.assertEqual(labeling_task.status, LabelingTaskStatus.COMPLETED)

  def test_update_statuses(self):
    tasks = [
      self.test_factory.create_labeling_task(status=LabelingTaskStatus.ANNOTATION),
      self.test_factory.create_labeling_task(status=LabelingTaskStatus.COMPLETED),
    ]

    LabelingTask.update_statuses(tasks, LabelingTaskStatus.ARCHIVED)

    for got in LabelingTask.objects.filter(pk__in=[t.id for t in tasks]).all():
      self.assertEqual(got.status, LabelingTaskStatus.ARCHIVED)

  def test_set_failed(self):
    labeling_task = self.test_factory.create_labeling_task()

    labeling_task.set_failed(error='some error')

    labeling_task.refresh_from_db()
    self.assertEqual(labeling_task.error, 'some error')
