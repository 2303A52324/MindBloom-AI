import { useState, useEffect, useCallback, useRef } from 'react';
import { socket } from '../socket/socket';

export const useChat = (sessionId) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // We expect the consumer to set auth token and connect
    socket.on('history_loaded', (loadedMessages) => {
      setMessages(loadedMessages);
      scrollToBottom();
    });

    socket.on('bot_typing', (typing) => {
      setIsTyping(typing);
      if (typing) scrollToBottom();
    });

    socket.on('bot_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    socket.on('crisis_alert', (data) => {
      setCrisisAlert(data);
    });

    socket.on('error_message', (err) => {
      setError(err);
      setTimeout(() => setError(null), 5000);
    });

    return () => {
      socket.off('history_loaded');
      socket.off('bot_typing');
      socket.off('bot_message');
      socket.off('crisis_alert');
      socket.off('error_message');
    };
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const loadHistory = useCallback(() => {
    if (sessionId) {
      socket.emit('load_history', { sessionId });
    }
  }, [sessionId]);

  const sendMessage = useCallback((text, expression = null) => {
    if (!text.trim() || !sessionId) return;
    
    // Optimistically update UI
    const tempMsg = {
      _id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      expression: expression,
      createdAt: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, tempMsg]);
    scrollToBottom();
    
    socket.emit('user_message', { sessionId, text, expression });
  }, [sessionId]);

  return {
    messages,
    isTyping,
    crisisAlert,
    error,
    sendMessage,
    loadHistory,
    messagesEndRef,
    setCrisisAlert
  };
};
