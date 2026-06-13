const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = require('./config/db');
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup with polling and websocket transports for Render compatibility
const io = new Server(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL, 
      'http://localhost:5173', 
      'https://mind-bloom-ai-eta.vercel.app'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.CLIENT_URL, 
    'http://localhost:5173', 
    'https://mind-bloom-ai-eta.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/chat', require('./routes/chat'));

// Socket.io middleware for auth
io.use((socket, next) => {
  let token = socket.handshake.auth.token;
  
  if (!token && socket.handshake.headers.cookie) {
    const match = socket.handshake.headers.cookie.match(new RegExp('(^| )token=([^;]+)'));
    if (match) {
      token = match[2];
    }
  }

  if (!token) {
    return next(new Error('Authentication error'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket.io handlers
const handleChatEvents = require('./socket/chatHandler');
io.on('connection', (socket) => {
  handleChatEvents(io, socket);
});

// Basic route
app.get('/', (req, res) => {
  res.send('MindBloom API is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
