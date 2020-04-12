const express = require('express');
const authRoutes = require('./cvat/auth.routes');
const tasksRoutes = require('./cvat/tasks.routes');
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tasks', tasksRoutes);

module.exports = router;