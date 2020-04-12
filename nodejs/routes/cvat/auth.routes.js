const express = require('express');
const authController = require('../../controllers/cvat/auth.controller');
const router = express.Router();

router.post('/login', authController.login);

module.exports = router;