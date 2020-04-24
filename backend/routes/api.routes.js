const express = require('express');
const router = express.Router();
const auth = require('../components/auth/routes');
const labeling_task = require('../components/labeling_task/routes');
const media_asset = require('../components/media_asset/routes');
const bucket_dataset = require('../components/bucket_dataset/routes');
const users = require('../components/user/routes');

router.use('/auth', auth);
router.use('/labeling_tasks', labeling_task);
router.use('/media_asset', media_asset);
router.use('/bucket_dataset', bucket_dataset);
router.use('/users', users);

module.exports = router;