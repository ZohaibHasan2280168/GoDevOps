const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const speakeasy = require('speakeasy');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/)
    .withMessage('Password must contain at least one uppercase, one lowercase, one number, and one special character')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user with 2FA disabled by default
    const user = new User({ 
      name, 
      email, 
      password,
      twoFactorEnabled: false 
    });
    
    await user.save();

    res.status(201).json({
      message: 'Account created successfully! You can now login.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        twoFactorEnabled: false
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password, deviceInfo } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password +twoFactorSecret');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // If 2FA is enabled, require verification
    if (user.twoFactorEnabled && user.twoFactorSecret) {
      console.log('2FA is enabled for user, requiring verification');
      return res.json({
        requiresTwoFactor: true,
        message: 'Two-factor authentication required',
        email: user.email,
        userId: user._id,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          twoFactorEnabled: true
        }
      });
    }

    // No 2FA required, generate token and send response
    console.log('2FA not enabled, proceeding with login');
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        twoFactorEnabled: false
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   POST /api/auth/verify-2fa
// @desc    Verify 2FA code and complete login
// @access  Public
router.post('/verify-2fa', async (req, res) => {
  try {
    const { userId, code } = req.body;
    
    if (!userId || !code) {
      return res.status(400).json({ message: 'User ID and verification code are required' });
    }

    if (code.length !== 6) {
      return res.status(400).json({ message: 'Verification code must be 6 digits' });
    }

    // Find user and include 2FA secret
    const user = await User.findById(userId).select('+twoFactorSecret');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return res.status(400).json({ message: '2FA is not enabled for this user' });
    }

    // Verify TOTP code with a 2-minute window
    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code.toString(),
      window: 4, // 2 minutes (4 * 30 seconds)
      step: 30
    });

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid or expired verification code' });
    }

    // Generate token after successful verification
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: '2FA verification successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        twoFactorEnabled: true
      }
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ message: 'Server error during 2FA verification' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;