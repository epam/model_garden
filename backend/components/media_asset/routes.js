const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const mediaAssetController = require('./controller');
const router = express.Router();

router.post('/upload_images', upload.array('file'), mediaAssetController.uploadImages);

module.exports = router;