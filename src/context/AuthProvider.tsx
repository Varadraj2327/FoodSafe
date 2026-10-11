import React, { useEffect, useState } from 'react';
import type { User, UserRegisterRequest } from '../types';
import { AuthContext } from './AuthContextInstance';
import { apiService } from '../services/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('foodsafe-token'));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    if (!token) {
      Promise.resolve().then(() => {
        if (active) {
          setUser(null);
          setLoading(false);
        }
      });
      return () => {
        active = false;
      };
    }

    apiService
      .getCurrentUser()
      .then((profile) => {
        if (active) {
          setUser(profile);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to validate JWT token session:', err);
        if (active) {
          localStorage.removeItem('foodsafe-token');
          setToken(null);
          setUser(null);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [token]);

  const login = async (username: string, password: string) => {
    const response = await apiService.login(username, password);
    const newToken = response.access_token;
    localStorage.setItem('foodsafe-token', newToken);
    setToken(newToken);
  };

  const register = async (data: UserRegisterRequest) => {
    const response = await apiService.register(data);
    const newToken = response.access_token;
    localStorage.setItem('foodsafe-token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('foodsafe-token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token && user);
  const isAdmin = Boolean(isAuthenticated && user?.is_admin);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
