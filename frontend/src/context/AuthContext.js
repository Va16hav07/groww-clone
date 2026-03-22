import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { fetchWithAuth } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app load
    const loadUser = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          // Verify token and fetch profile
          const data = await fetchWithAuth('/auth/profile');
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to load user', error);
        await SecureStore.deleteItemAsync('userToken');
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      await SecureStore.setItemAsync('userToken', data.token);
      
      // Fetch profile after login
      const profile = await fetchWithAuth('/auth/profile');
      setUser(profile.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const data = await fetchWithAuth('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      await SecureStore.setItemAsync('userToken', data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
