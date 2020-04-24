const BucketDataset = require("./BucketDataset");

const saveBucketDataset = async (bucketName, folderName) => {
  try {
    const dbResponse = await new BucketDataset({
      bucketName: bucketName,
      directoryPath: folderName,
    }).save();
    return dbResponse;
  } catch (error) {
    return error;
  }
};

const getPathsByBucketName = async (bucketName) => {
  try {
    return await BucketDataset.find({ bucketName });
  } catch (error) {
    return error;
  }
};

const getPath = async (bucketName, bucketPath) => {
  try {
    const dbResponse = await BucketDataset.findOne({ bucketName, directoryPath: bucketPath });
    return dbResponse;
  } catch (error) {
    return error;
  }
};

module.exports = {
  saveBucketDataset,
  getPathsByBucketName,
  getPath
};
