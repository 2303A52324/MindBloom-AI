import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        setUser(res.data.user);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
      return false;
    }
  };

  const login = async (userData) => {
    try {
      setError(null);
      const res = await api.post('/auth/login', userData);
      if (res.data.success) {
        setUser(res.data.user);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.get('/auth/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
