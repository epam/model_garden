const express = require('express');
const usersController = require('./controller');
const router = express.Router();

router.get('/labeling_tool_users', usersController.getLabelingToolUsers);

module.exports = router;