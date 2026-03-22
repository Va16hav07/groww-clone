import React, { useState, useContext } from 'react';
import './global.css';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import StocksScreen from './src/screens/Stocks/index';
import ProfileScreen from './src/screens/Profile/index';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

type ScreenName = 'login' | 'signup' | 'stocks' | 'profile';

interface User {
  name?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

function RootNavigator(): React.ReactElement {
  const { user, isLoading } = useContext(AuthContext) as AuthContextType;
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('login');

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  if (user) {
    if (currentScreen === 'profile') {
      return <ProfileScreen onNavigateToHome={() => setCurrentScreen('stocks')} />;
    }
    return <StocksScreen onNavigateToProfile={() => setCurrentScreen('profile')} />;
  }

  if (currentScreen === 'signup') {
    return <SignupScreen onNavigateToLogin={() => setCurrentScreen('login')} />;
  }

  return <LoginScreen onNavigateToSignup={() => setCurrentScreen('signup')} />;
}

export default function App(): React.ReactElement {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
