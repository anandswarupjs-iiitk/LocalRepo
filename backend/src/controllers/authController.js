const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

const generateTokens = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
  return { token, refreshToken };
};

const sendTokenResponse = (user, statusCode, res) => {
  const { token, refreshToken } = generateTokens(user._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });

    await ActivityLog.create({
      user: user._id,
      event: 'USER_REGISTERED',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      await ActivityLog.create({
        event: 'FAILED_LOGIN',
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        meta: { email },
      });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    await ActivityLog.create({
      user: user._id,
      event: 'USER_LOGIN',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

exports.setup2FA = async (req, res, next) => {
  try {
    const secret = speakeasy.generateSecret({ name: `FraudGuard (${req.user.email})` });

    await User.findByIdAndUpdate(req.user._id, { twoFactorSecret: secret.base32 });

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    res.status(200).json({ success: true, qrCode, secret: secret.base32 });
  } catch (error) {
    next(error);
  }
};

exports.verify2FA = async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user._id).select('+twoFactorSecret');

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!verified) {
      return res.status(400).json({ success: false, message: 'Invalid 2FA token' });
    }

    await User.findByIdAndUpdate(req.user._id, { twoFactorEnabled: true });

    await ActivityLog.create({
      user: req.user._id,
      event: '2FA_ENABLED',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({ success: true, message: '2FA enabled successfully' });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const { token: newToken, refreshToken: newRefreshToken } = generateTokens(user._id);

    await ActivityLog.create({
      user: user._id,
      event: 'TOKEN_REFRESHED',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json({ success: true, token: newToken, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Refresh token invalid or expired' });
  }
};