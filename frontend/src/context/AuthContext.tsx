import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { fetchWithAuth } from '../services/api';

export interface User {
  id?: string;
  name?: string;
  email?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isPinSet: boolean;
  isPinVerified: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setPin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  authenticateWithBiometrics: () => Promise<boolean>;
  resetPinVerification: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPinSet, setIsPinSet] = useState(false);
  const [isPinVerified, setIsPinVerified] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const pin = await SecureStore.getItemAsync('userPin');
        
        if (pin) {
          setIsPinSet(true);
        }

        if (token) {
          const data = await fetchWithAuth('/auth/profile');
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to load auth data', error);
        await SecureStore.deleteItemAsync('userToken');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      await SecureStore.setItemAsync('userToken', data.token);
      
      const profile = await fetchWithAuth('/auth/profile');
      setUser(profile.user);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const data = await fetchWithAuth('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      await SecureStore.setItemAsync('userToken', data.token);
      setUser(data.user);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    setUser(null);
    setIsPinVerified(false);
  };

  const setPin = async (pin: string) => {
    await SecureStore.setItemAsync('userPin', pin);
    setIsPinSet(true);
    setIsPinVerified(true);
  };

  const verifyPin = async (pin: string) => {
    const storedPin = await SecureStore.getItemAsync('userPin');
    if (storedPin === pin) {
      setIsPinVerified(true);
      return true;
    }
    return false;
  };

  const authenticateWithBiometrics = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Groww',
      fallbackLabel: 'Enter PIN',
    });

    if (result.success) {
      setIsPinVerified(true);
      return true;
    }
    return false;
  };

  const resetPinVerification = () => {
    setIsPinVerified(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isPinSet, 
      isPinVerified, 
      login, 
      signup, 
      logout,
      setPin,
      verifyPin,
      authenticateWithBiometrics,
      resetPinVerification
    }}>
      {children}
    </AuthContext.Provider>
  );
};
