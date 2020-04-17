const express = require('express');
const router = express.Router();
const auth = require('../components/auth/routes');
const tasks = require('../components/tasks/routes');

router.use('/auth', auth);
router.use('/tasks', tasks);

module.exports = router;