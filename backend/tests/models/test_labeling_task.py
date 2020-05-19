from model_garden.constants import LabelingTaskStatus
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
      "LabelingTask(name='Test labeling task', status='annotation', labeler='test_labeler')",
    )
