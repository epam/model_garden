from unittest import TestCase

from model_garden.utils import chunkify


class TestChunkify(TestCase):
  def test_empty(self):
    self.assertEqual(list(chunkify([], 2)), [])

  def test_chunkify(self):
    self.assertEqual(list(chunkify([0, 1, 2, 3, 4], 2)), [[0, 1], [2, 3], [4]])

  def test_chunk_larger_than_array_size(self):
    self.assertEqual(list(chunkify([1, 2], 3)), [[1, 2]])

  def test_zero_chunk(self):
    with self.assertRaises(ValueError):
      list(chunkify([1, 2], 0))
