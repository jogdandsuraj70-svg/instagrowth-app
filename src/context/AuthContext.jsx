import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '../config/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('omniconnect_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('omniconnect_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        const res = await fetchApi('/auth/me');
        if (res.ok && res.user) {
          setUser(res.user);
          localStorage.setItem('omniconnect_user', JSON.stringify(res.user));
        } else {
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    verifyAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('omniconnect_token', res.token);
      localStorage.setItem('omniconnect_user', JSON.stringify(res.user));
      return { success: true, user: res.user };
    }
    return { success: false, error: res.error || 'Login failed' };
  };

  const register = async (email, password, name) => {
    const res = await fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });

    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('omniconnect_token', res.token);
      localStorage.setItem('omniconnect_user', JSON.stringify(res.user));
      return { success: true, user: res.user };
    }
    return { success: false, error: res.error || 'Registration failed' };
  };

  const loginOAuth = async (provider, oauthToken, email, name) => {
    const res = await fetchApi('/auth/oauth', {
      method: 'POST',
      body: JSON.stringify({ provider, oauthToken, email, name })
    });

    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('omniconnect_token', res.token);
      localStorage.setItem('omniconnect_user', JSON.stringify(res.user));
      return { success: true, user: res.user, message: res.message };
    }
    return { success: false, error: res.error || 'OAuth connection failed' };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('omniconnect_token');
    localStorage.removeItem('omniconnect_user');
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        loginOAuth,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
