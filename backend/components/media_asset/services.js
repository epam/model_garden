const MediaAsset = require('./MediaAsset');

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

module.exports = {
  saveMediaAsset,
};
