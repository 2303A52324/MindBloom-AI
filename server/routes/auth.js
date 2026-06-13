const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// Rate limiting: 10 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many auth requests from this IP, please try again after 15 minutes' }
});

const sendTokenResponse = (user, statusCode, res) => {
  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
};

// @route   POST /api/auth/register
router.post(
  '/register',
  authLimiter,
  [
    body('name', 'Name is required').not().isEmpty().trim(),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 }),
    body('password', 'Password must include uppercase, lowercase, and a number').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;

    User.findOne({ email })
      .then((existingUser) => {
        if (existingUser) {
          return res.status(400).json({ success: false, error: 'User already exists' });
        }

        bcrypt.genSalt(12)
          .then((salt) => bcrypt.hash(password, salt))
          .then((hashedPassword) => {
            const newUser = new User({
              name,
              email,
              password: hashedPassword
            });

            return newUser.save();
          })
          .then((savedUser) => {
            sendTokenResponse(savedUser, 201, res);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ success: false, error: 'Server error during registration' });
          });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error during user lookup' });
      });
  }
);

// @route   POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  [
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password is required').exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    User.findOne({ email }).select('+password')
      .then((user) => {
        if (!user) {
          return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        bcrypt.compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch) {
              return res.status(401).json({ success: false, error: 'Invalid credentials' });
            }

            sendTokenResponse(user, 200, res);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ success: false, error: 'Server error during password comparison' });
          });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error during login' });
      });
  }
);

// @route   GET /api/auth/me
router.get('/me', protect, (req, res) => {
  User.findById(req.user.id)
    .then((user) => {
      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, error: 'Server error fetching user profile' });
    });
});

// @route   GET /api/auth/logout
router.get('/logout', (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({ success: true, data: {} });
});

module.exports = router;
