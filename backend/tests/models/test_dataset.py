from model_garden.models import Dataset
from tests import BaseTestCase


class TestDataset(BaseTestCase):

  def test_str(self):
    dataset = self.test_factory.create_dataset()

    self.assertEqual(str(dataset),
                     f"Dataset(path='{dataset.path}', bucket='{dataset.bucket.name}', "
                     f"dataset_format='{dataset.dataset_format}')")

  def test_create(self):
    self.test_factory.create_dataset()

    self.assertEqual(Dataset.objects.count(), 1)
