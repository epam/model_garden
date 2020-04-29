const MediaAsset = require('./MediaAsset');
const bucketDatasetServices = require('../bucket_dataset/services');

const saveMediaAsset = async (bucketDatasetId, fileNames) => {
  try {
    await Promise.all(
      fileNames.map((name) => {
        const mediaAsset = new MediaAsset({
          bucketDatasetId,
          fileName: name,
          status: 0,
        });
        return mediaAsset.save();
      })
    );
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const getMediaAssets = async (bucketName, bucketPath) => {
  let bucketDatasetId = null;

  try {
    const dbResult = await bucketDatasetServices.getPath(bucketName, bucketPath);
    bucketDatasetId = dbResult.id;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
  try {
    const mediaAssets = await MediaAsset.find({ bucketDatasetId });
    return mediaAssets;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

module.exports = {
  saveMediaAsset,
  getMediaAssets
};
