from model_garden.admin import LabelingTaskAdmin
from model_garden.constants import LabelingTaskStatus
from model_garden.models import LabelingTask
from tests import BaseTestCase


class TestLabelingTaskAdmin(BaseTestCase):
  def test_get_protected_by_status_when_no_objects(self):
    tasks = []

    self.assertListEqual(LabelingTaskAdmin.get_protected_by_status(tasks), [])

  def test_get_protected_by_status_when_all_are_archived(self):
    tasks = [
      LabelingTask(status=LabelingTaskStatus.ARCHIVED),
      LabelingTask(status=LabelingTaskStatus.ARCHIVED),
    ]

    self.assertListEqual(LabelingTaskAdmin.get_protected_by_status(tasks), [])

  def test_get_protected_by_status_when_some_tasks_are_not_archived(self):
    tasks = [
      LabelingTask(task_id=123, status=LabelingTaskStatus.ARCHIVED),
      LabelingTask(task_id=456, status=LabelingTaskStatus.VALIDATION),
      LabelingTask(task_id=789, status=LabelingTaskStatus.ANNOTATION),
    ]

    got = LabelingTaskAdmin.get_protected_by_status(tasks)

    self.assertEqual(len(got), 2)
    for index, task_id in enumerate(map(str, (456, 789))):
      self.assertIn(task_id, got[index])
