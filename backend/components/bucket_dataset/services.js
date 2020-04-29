const BucketDataset = require("./BucketDataset");

const saveBucketDataset = async (bucketName, folderName) => {
  let bucketDataset = null;
  let existedDataset = null;

  try {
    existedDataset = await BucketDataset.findOne({ directoryPath: folderName });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }

  if (existedDataset) {
    throw new Error(`The dataset with name '${folderName}' is already exist`);
  }

  try {
    bucketDataset = await new BucketDataset({
      bucketName,
      directoryPath: folderName,
    }).save();
    return bucketDataset.id;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const getPathsByBucketName = async (bucketName) => {
  try {
    return await BucketDataset.find({ bucketName });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const getPath = async (bucketName, bucketPath) => {
  try {
    const dbResponse = await BucketDataset.findOne({
      bucketName,
      directoryPath: bucketPath,
    });
    return dbResponse;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

module.exports = {
  saveBucketDataset,
  getPathsByBucketName,
  getPath,
};
