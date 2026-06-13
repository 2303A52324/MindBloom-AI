const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/users/profile
router.get('/profile', protect, (req, res) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.status(200).json({ success: true, data: user });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, error: 'Server error' });
    });
});

// @route   GET /api/users/counselors
router.get('/counselors', protect, (req, res) => {
  User.find({ role: 'counselor' }).select('name email')
    .then((counselors) => {
      res.status(200).json({ success: true, data: counselors });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, error: 'Server error' });
    });
});

module.exports = router;
