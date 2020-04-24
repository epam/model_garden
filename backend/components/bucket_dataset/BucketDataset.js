const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BucketDatasetSchema = new Schema({
  bucketName: {
    type: String,
    required: true,
  },
  directoryPath: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = BucketDataset = mongoose.model(
  "bucket_dataset",
  BucketDatasetSchema
);
