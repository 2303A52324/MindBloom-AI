const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/chat/history/:sessionId
// @desc    Get chat history for a session
router.get('/history/:sessionId', protect, (req, res) => {
  Message.find({ sessionId: req.params.sessionId, userId: req.user.id })
    .sort({ createdAt: 1 })
    .limit(100)
    .then((messages) => {
      res.status(200).json({ success: true, data: messages });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, error: 'Server error' });
    });
});

// @route   GET /api/chat/sessions
// @desc    Get all distinct sessions for a user
router.get('/sessions', protect, (req, res) => {
  Message.distinct('sessionId', { userId: req.user.id })
    .then((sessions) => {
      res.status(200).json({ success: true, data: sessions });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, error: 'Server error' });
    });
});

// @route   GET /api/chat/dashboard
// @desc    Get data for the dashboard
router.get('/dashboard', protect, (req, res) => {
  Message.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50)
    .then((messages) => {
      let crisisCount = 0;
      let totalMessages = messages.length;
      let dominantEmotionCounts = {};
      
      messages.forEach(msg => {
        if (msg.isCrisis) crisisCount++;
        if (msg.nlpData && msg.nlpData.emotion) {
          const em = msg.nlpData.emotion;
          dominantEmotionCounts[em] = (dominantEmotionCounts[em] || 0) + 1;
        }
      });
      
      let dominantEmotion = "neutral";
      let maxCount = 0;
      for (const [em, count] of Object.entries(dominantEmotionCounts)) {
        if (count > maxCount) {
          maxCount = count;
          dominantEmotion = em;
        }
      }

      res.status(200).json({ 
        success: true, 
        data: {
          recentMessages: messages.slice(0, 10),
          stats: {
            totalMessages,
            crisisCount,
            dominantEmotion
          }
        } 
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, error: 'Server error' });
    });
});

module.exports = router;
