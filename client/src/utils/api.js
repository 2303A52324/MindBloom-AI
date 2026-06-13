import axios from 'axios';

const isProd = import.meta.env.PROD;
const apiBaseURL = import.meta.env.VITE_API_URL || (isProd ? 'https://mindbloom-ai-b0ml.onrender.com/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
