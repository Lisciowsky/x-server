import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { UserInfo } from '@/api/models/user';
import { useAlert } from './alert-context';
import { checkSession, loginUser, createUser, logoutUser, CreateUserRequest } from '@/api/users-endpoints';
import { registerGlobalLogout } from '@/lib/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (indicator: boolean) => void;
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
  login: (credentials: { username: string; password: string }) => Promise<boolean>;
  signup: (credentials: { email: string; username: string; password: string; fullname?: string }) => Promise<boolean>;
  logout: () => void;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { showAlert } = useAlert();

  registerGlobalLogout(() => {
    return logout()
  })

  const checkUserSession = async () => {
    try {
      const response: UserInfo = await checkSession();
      setIsLoggedIn(true);
      setUserInfo(response);
    } catch (error) {
      logout()
    }
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  const login = useCallback(async (credentials: { username: string; password: string }) => {
    try {
      await loginUser(credentials);
      setIsLoggedIn(true);
      await checkUserSession();
      return true;
    } catch (error) {
      showAlert(error.toString(), "", "warning");
      return false;
    }
  }, [showAlert]);

  const signup = useCallback(async (createUserRequest: CreateUserRequest) => {
    try {
      await createUser(createUserRequest);
      showAlert("Signup successful. Please log in.", "", "success");
      router.push('/login');
      return true;
    } catch (error) {
      showAlert(error.toString(), "", "warning");
      return false;
    }
  }, [router, showAlert]);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
      setIsLoggedIn(false);
      setUserInfo(null);
      router.push('/login');
    } catch (error) {
      showAlert("Error during logout. Please try again.", "", "warning");
    }
  }, [router, showAlert]);

  const value = { isLoggedIn, setIsLoggedIn, userInfo, setUserInfo, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
