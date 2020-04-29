const express = require('express');
const authController = require('./controllers');
const router = express.Router();

router.use('/login_cvat', authController.loginCvat);

module.exports = router;