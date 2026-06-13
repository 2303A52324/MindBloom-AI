const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  isCrisis: {
    type: Boolean,
    default: false
  },
  expression: {
    type: String,
    default: null
  },
  nlpData: {
    sentiment: String,
    sentimentScore: Number,
    emotion: String,
    intent: String,
    crisisScore: Number,
    crisisTier: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
