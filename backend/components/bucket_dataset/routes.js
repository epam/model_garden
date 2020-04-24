const express = require('express');
const bucketDatasetController = require('./controller');
const router = express.Router();

router.get('/bucket_names', bucketDatasetController.getBucketNames);

module.exports = router;