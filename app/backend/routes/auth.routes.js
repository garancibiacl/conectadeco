const express = require('express');

const authController = require('../controllers/auth.controller');
const { asyncHandler } = require('../middlewares/async-handler');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.get('/me', asyncHandler(requireAuth), asyncHandler(authController.me));

module.exports = router;
