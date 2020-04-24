const express = require('express');
const tasksController = require('./controller');
const router = express.Router();

router.post('/complete', tasksController.completeTask);
router.get('/:taskId', tasksController.getTask);
router.post('/', tasksController.createTask);

module.exports = router;