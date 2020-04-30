const MediaAsset = require("./MediaAsset");
const bucketDatasetServices = require("../bucket_dataset/services");

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

const getMediaAssets = async (bucketName, bucketPath, status) => {
  let bucketDatasetId = null;

  try {
    const dbResult = await bucketDatasetServices.getPath(
      bucketName,
      bucketPath
    );
    bucketDatasetId = dbResult.id;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
  try {
    const mediaAssets = await MediaAsset.find({ bucketDatasetId });
    if (status) {
      return mediaAssets.filter((mediaAsset) => mediaAsset.status === status);
    } else {
      return mediaAssets;
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const updateMediaAssetStatus = async (id, status) => {
  try {
    await MediaAsset.findByIdAndUpdate(id, { status });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

module.exports = {
  saveMediaAsset,
  getMediaAssets,
  updateMediaAssetStatus
};
