import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('arc_token');
    if (token) {
      getProfile()
        .then((data) => setUser(data.user))
        .catch(() => localStorage.removeItem('arc_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  function loginUser(token, userData) {
    localStorage.setItem('arc_token', token);
    setUser(userData);
  }

  function logoutUser() {
    localStorage.removeItem('arc_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
