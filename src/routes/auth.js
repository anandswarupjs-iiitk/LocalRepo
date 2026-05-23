const express = require('express');
const router = express.Router();
const {
  register, login, logout, getMe,
  setup2FA, verify2FA, refreshToken
} = require('../controllers/authController');
const { registerValidation, loginValidation, handleValidationErrors } = require('../middleware/validateInput');
const { verifyToken } = require('../middleware/verifyToken');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, registerValidation, handleValidationErrors, register);
router.post('/login',    authLimiter, loginValidation,    handleValidationErrors, login);
router.post('/logout',   verifyToken, logout);
router.get('/me',        verifyToken, getMe);
router.post('/refresh-token', refreshToken);
router.get('/2fa/setup',   verifyToken, setup2FA);
router.post('/2fa/verify', verifyToken, verify2FA);

module.exports = router;