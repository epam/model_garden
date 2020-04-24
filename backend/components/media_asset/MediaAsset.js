const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MediaAssetSchema = new Schema({
  bucketDatasetId: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    require: true
  }
});

module.exports = MediaAsset = mongoose.model('media_asset', MediaAssetSchema);