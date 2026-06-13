import { io } from 'socket.io-client';

const isProd = import.meta.env.PROD;
const URL = import.meta.env.VITE_SOCKET_URL || (isProd ? 'https://mindbloom-ai-b0ml.onrender.com' : 'http://localhost:5000');

export const socket = io(URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
  withCredentials: true
});
