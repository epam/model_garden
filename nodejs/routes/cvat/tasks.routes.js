const express = require('express');
const tasksController = require('../../controllers/cvat/tasks.controller');
const router = express.Router();

router.get('/:taskId', tasksController.getTask);
router.post('/', tasksController.createTask);
router.post('/:taskId/images', tasksController.setImages);

module.exports = router;