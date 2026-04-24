import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiRegister, apiGetMe } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // On mount, check if we have a saved token and validate it
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      apiGetMe()
        .then(profile => {
          setUser(profile);
          setToken(savedToken);
        })
        .catch(() => {
          // Token invalid/expired — clear it
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
          setUser(null);
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      setUser({ id: data.userId, name: data.name, email: data.email });
      setToken(data.token);
      localStorage.setItem('currentUser', data.email);
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || 'Invalid credentials' };
    }
  };

  const register = async (userData) => {
    try {
      const data = await apiRegister(userData.fullname, userData.email, userData.password);
      setUser({ id: data.userId, name: data.name, email: data.email });
      setToken(data.token);
      localStorage.setItem('currentUser', data.email);
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
