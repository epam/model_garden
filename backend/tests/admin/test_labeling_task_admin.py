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

  def test_get_protected_by_status_if_no_valid(self):
    tasks = [
      LabelingTask(status=LabelingTaskStatus.FAILED),
      LabelingTask(status=LabelingTaskStatus.ARCHIVED),
    ]

    self.assertListEqual(LabelingTaskAdmin.get_protected_by_status(tasks), [])

  def test_get_protected_by_status_all_failed(self):
    tasks = [
      LabelingTask(status=LabelingTaskStatus.FAILED),
      LabelingTask(status=LabelingTaskStatus.FAILED),
    ]

    self.assertListEqual(LabelingTaskAdmin.get_protected_by_status(tasks), [])

  def test_get_protected_by_status_when_some_tasks_are_not_archived(self):
    tasks = [
      LabelingTask(task_id=123, status=LabelingTaskStatus.ARCHIVED),
      LabelingTask(task_id=456, status=LabelingTaskStatus.VALIDATION),
      LabelingTask(task_id=789, status=LabelingTaskStatus.ANNOTATION),
    ]

    actual_protected = LabelingTaskAdmin.get_protected_by_status(tasks)
    expected_protected_task_ids = (456, 789)

    self.assertEqual(len(actual_protected), 2)
    for index, task_id in enumerate(map(str, expected_protected_task_ids)):
      self.assertIn(task_id, actual_protected[index])

  def test_get_protected_by_status_if_valid(self):
    tasks = [
      LabelingTask(task_id=123, status=LabelingTaskStatus.FAILED),
      LabelingTask(task_id=456, status=LabelingTaskStatus.VALIDATION),
      LabelingTask(task_id=789, status=LabelingTaskStatus.ANNOTATION),
    ]

    actual_protected = LabelingTaskAdmin.get_protected_by_status(tasks)
    expected_protected_task_ids = (456, 789)

    self.assertEqual(len(actual_protected), 2)
    for index, task_id in enumerate(map(str, expected_protected_task_ids)):
      self.assertIn(task_id, actual_protected[index])
