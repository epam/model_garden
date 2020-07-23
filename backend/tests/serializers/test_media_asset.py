from tests import BaseTestCase

from model_garden.constants import LabelingTaskStatus
from model_garden.serializers import MediaAssetSerializer


class TestMediaAssetSerializer(BaseTestCase):

  def test_serialize(self):
    media_asset = self.test_factory.create_media_asset()

    serializer = MediaAssetSerializer(media_asset)

    self.assertEqual(
      serializer.data,
      {
        'dataset': media_asset.dataset.id,
        'filename': media_asset.filename,
        'remote_path': media_asset.remote_path,
        'remote_xml_path': None,
      },
    )

  def test_serialize_with_remote_xml_path(self):
    labeling_task = self.test_factory.create_labeling_task(status=LabelingTaskStatus.SAVED)
    media_asset = self.test_factory.create_media_asset()
    media_asset.labeling_task = labeling_task
    media_asset.save(update_fields=('labeling_task',))

    serializer = MediaAssetSerializer(media_asset)

    self.assertEqual(
      serializer.data,
      {
        'dataset': media_asset.dataset.id,
        'filename': media_asset.filename,
        'remote_path': media_asset.remote_path,
        'remote_xml_path': media_asset.remote_xml_path,
      },
    )
