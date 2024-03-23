import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/lib/axiosInstance';

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (indicator: boolean) => void;
  username: string | null;
  login: (credentials: { username: string; password: string }) => Promise<boolean>;
  signup: (credentials: { email: string; username: string; password: string; fullname?: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Check for access token and username in localStorage when component mounts
    const token = localStorage.getItem('access_token');
    const storedUsername = localStorage.getItem('username');
    
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const login = useCallback(async (credentials: { username: string; password: string }) => {
    try {
      const response = await axiosInstance.post('/users/login', credentials);
      const { access_token, refresh_token, user} = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('username', user.username);
      setIsLoggedIn(true);
      setUsername(credentials.username);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const signup = useCallback(async (credentials: { email: string; username: string; password: string; fullname?: string }) => {
    try {
      await axiosInstance.post('/users/', credentials);
      // Optionally, log the user in immediately after signup
      // return login({ username: credentials.username, password: credentials.password });
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  }, [login]); // Include login in the dependency array if you choose to log the user in immediately after signup

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername(null);
  }, []);

  const value = { isLoggedIn, setIsLoggedIn, username, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
