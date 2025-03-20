import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [userId, setUserId] = useState(localStorage.getItem('user_id'));

  const login = (newToken, username, userId) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', username);
    localStorage.setItem('user_id', userId);

    setToken(newToken);
    setUsername(username);
    setUserId(userId);
  }

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    setToken(null);
    setUsername(null);
    setUserId(null);
  }

  return (
    <AuthContext.Provider value={{ token, username, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};