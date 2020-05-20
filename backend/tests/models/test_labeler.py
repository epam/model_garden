from tests import BaseTestCase


class TestLabeler(BaseTestCase):
  def test_create(self):
    labeler = self.test_factory.create_labeler(labeler_id=3)

    self.assertEqual(labeler.labeler_id, 3)

  def test_str(self):
    labeler = self.test_factory.create_labeler(labeler_id=3)

    self.assertEqual(str(labeler), "Labeler(labeler_id=3, username='test_labeler_3')")
