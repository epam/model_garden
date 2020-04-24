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
    console.error("Saving media asset to the db is failed");
  }
};

const getMediaAssets = async (bucketName, bucketPath) => {
  const dbResult = await bucketDatasetServices.getPath(bucketName, bucketPath);
  const mediaAssets = await MediaAsset.find({ bucketDatasetId: dbResult._id });
  return mediaAssets;
};

module.exports = {
  saveMediaAsset,
  getMediaAssets
};
