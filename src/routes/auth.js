const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const { registerValidation, loginValidation, handleValidationErrors } = require('../middleware/validateInput');
const { verifyToken } = require('../middleware/verifyToken');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, registerValidation, handleValidationErrors, register);
router.post('/login',    authLimiter, loginValidation,    handleValidationErrors, login);
router.post('/logout',   verifyToken, logout);
router.get('/me',        verifyToken, getMe);

module.exports = router;