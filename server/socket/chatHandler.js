const Message = require('../models/Message');
const axios = require('axios');

const handleChatEvents = (io, socket) => {
  console.log(`User connected to chat: ${socket.user.id}`);

  socket.on('load_history', ({ sessionId }) => {
    Message.find({ sessionId, userId: socket.user.id })
      .sort({ createdAt: -1 })
      .limit(30)
      .then((messages) => {
        socket.emit('history_loaded', messages.reverse());
      })
      .catch((err) => {
        console.error('Error loading history:', err);
        socket.emit('error_message', 'Failed to load chat history');
      });
  });

  socket.on('user_message', ({ sessionId, text, expression }) => {
    if (!text || text.trim() === '') return;

    // 1. Save user message
    const userMessage = new Message({
      sessionId,
      userId: socket.user.id,
      sender: 'user',
      text: text.trim(),
      expression: expression || null
    });

    userMessage.save()
      .then((savedUserMessage) => {
        // Emit message back to client immediately for optimistic UI update (if not already done client side)
        // We will just let the client handle their own message display for speed,
        // but we'll proceed to call the NLP service
        
        socket.emit('bot_typing', true);

        const nlpUrl = process.env.NLP_SERVICE_URL || 'http://localhost:8000';
        return axios.post(`${nlpUrl}/analyze`, { 
          text: text.trim(),
          expression: expression || null
        })
          .then((response) => {
            const nlpData = response.data;
            
            // 2. Prepare bot message
            const botMessage = new Message({
              sessionId,
              userId: socket.user.id,
              sender: 'bot',
              text: nlpData.bot_response,
              isCrisis: nlpData.is_crisis,
              nlpData: {
                sentiment: nlpData.sentiment,
                sentimentScore: nlpData.sentiment_score,
                emotion: nlpData.emotion,
                intent: nlpData.intent,
                crisisScore: nlpData.crisis_score,
                crisisTier: nlpData.crisis_tier
              }
            });

            // 3. Save bot message
            return botMessage.save().then((savedBotMessage) => {
              socket.emit('bot_typing', false);
              socket.emit('bot_message', savedBotMessage);

              if (nlpData.is_crisis) {
                socket.emit('crisis_alert', { tier: nlpData.crisis_tier });
                // We could also send email here using emailjs or nodemailer
              }
            });
          })
          .catch((err) => {
            console.error('NLP Service Error:', err.message);
            socket.emit('bot_typing', false);
            socket.emit('bot_message', { 
              sender: 'bot', 
              text: "I'm having trouble understanding right now. Please give me a moment.",
              createdAt: new Date()
            });
          });
      })
      .catch((err) => {
        console.error('Error saving user message:', err);
        socket.emit('error_message', 'Failed to send message');
      });
  });

  socket.on('user_expression_proactive', ({ sessionId, expression }) => {
    if (!expression || expression === 'neutral' || !sessionId) return;

    socket.emit('bot_typing', true);

    const nlpUrl = process.env.NLP_SERVICE_URL || 'http://localhost:8000';
    axios.post(`${nlpUrl}/analyze`, { 
      text: "", 
      expression: expression 
    })
      .then((response) => {
        const nlpData = response.data;
        
        // Prepare bot message reacting to expression
        const botMessage = new Message({
          sessionId,
          userId: socket.user.id,
          sender: 'bot',
          text: nlpData.bot_response,
          isCrisis: false,
          nlpData: {
            sentiment: nlpData.sentiment,
            sentimentScore: nlpData.sentiment_score,
            emotion: expression,
            intent: 'proactive_expression',
            crisisScore: 0,
            crisisTier: 'none'
          }
        });

        return botMessage.save().then((savedBotMessage) => {
          socket.emit('bot_typing', false);
          socket.emit('bot_message', savedBotMessage);
        });
      })
      .catch((err) => {
        console.error('Proactive Expression NLP Error:', err.message);
        socket.emit('bot_typing', false);
      });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.id}`);
  });
};

module.exports = handleChatEvents;
