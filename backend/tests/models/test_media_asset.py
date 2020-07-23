from tests import BaseTestCase


class TestMediaAsset(BaseTestCase):

  def setUp(self):
    super().setUp()
    self.filename = 'media_asset_test.jpg'

  def test_create(self):
    media_asset = self.test_factory.create_media_asset(filename=self.filename)

    self.assertEqual(media_asset.filename, self.filename)

  def test_full_path(self):
    media_asset = self.test_factory.create_media_asset(filename=self.filename)

    self.assertEqual(media_asset.full_path, "test_path/media_asset_test.jpg")

  def test_full_xml_path(self):
    media_asset = self.test_factory.create_media_asset(filename=self.filename)

    self.assertEqual(media_asset.full_xml_path, "test_path/media_asset_test.jpg.xml")

  def test_remote_path(self):
    media_asset = self.test_factory.create_media_asset(filename=self.filename)

    self.assertEqual(media_asset.remote_path, "https://d3o54g14k1n39o.cloudfront.net/test_path/media_asset_test.jpg")

  def test_remote_path_with_empty_spaces(self):
    media_asset = self.test_factory.create_media_asset(filename='test name.jpg')

    self.assertEqual(
      media_asset.remote_path,
      "https://d3o54g14k1n39o.cloudfront.net/test_path/test%20name.jpg",
    )

  def test_remote_xml_path(self):
    media_asset = self.test_factory.create_media_asset(filename=self.filename)

    self.assertEqual(
      media_asset.remote_xml_path,
      "https://d3o54g14k1n39o.cloudfront.net/test_path/media_asset_test.jpg.xml",
    )
