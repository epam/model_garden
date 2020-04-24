const BucketDataset = require('./BucketDataset');

const saveBucketDataset = async (folderName) => {
  try {
    const dbResponse = await new BucketDataset({
      directoryPath: folderName,
    }).save();
    return dbResponse;
  } catch (error) {
    return error;
  }
};

module.exports = {
  saveBucketDataset
};