import React, { useState, useContext } from 'react';
import './global.css';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import StocksScreen from './src/screens/Stocks/index';
import ProfileScreen from './src/screens/Profile/index';
import StockDetailsScreen from './src/screens/StockDetailsScreen';
import OrderHistoryScreen from './src/screens/OrderHistoryScreen';
import OrderEntryScreen from './src/screens/OrderEntryScreen';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { PriceProvider } from './src/context/PriceContext';

import PinSetupScreen from './src/screens/PinSetupScreen';
import PinLoginScreen from './src/screens/PinLoginScreen';

type ScreenName = 'login' | 'signup' | 'stocks' | 'profile' | 'details' | 'orders' | 'orderEntry';

function RootNavigator(): React.ReactElement {
  const { user, isLoading, isPinSet, isPinVerified } = useContext(AuthContext) as any;
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('login');
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">('BUY');

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  if (user) {
    // Security layer
    if (!isPinSet) {
      return <PinSetupScreen />;
    }
    if (!isPinVerified) {
      return <PinLoginScreen />;
    }

    if (currentScreen === 'profile') {
      return <ProfileScreen onNavigateToHome={() => setCurrentScreen('stocks')} onNavigateToOrders={() => setCurrentScreen('orders')} />;
    }
    if (currentScreen === 'details' && selectedStock) {
      return <StockDetailsScreen stock={selectedStock} onBack={() => setCurrentScreen('stocks')} onNavigateToEntry={(type) => { setTradeType(type); setCurrentScreen('orderEntry'); }} />;
    }
    if (currentScreen === 'orderEntry' && selectedStock) {
      return <OrderEntryScreen symbol={selectedStock.symbol} tradeType={tradeType} onBack={() => setCurrentScreen('details')} onNavigateToOrders={() => setCurrentScreen('orders')} />;
    }
    if (currentScreen === 'orders') {
      return <OrderHistoryScreen onBack={() => setCurrentScreen('profile')} />;
    }
    return <StocksScreen onNavigateToProfile={() => setCurrentScreen('profile')} onNavigateToDetails={(stock: any) => { setSelectedStock(stock); setCurrentScreen('details'); }} />;
  }

  if (currentScreen === 'signup') {
    return <SignupScreen onNavigateToLogin={() => setCurrentScreen('login')} />;
  }

  return <LoginScreen onNavigateToSignup={() => setCurrentScreen('signup')} />;
}

export default function App(): React.ReactElement {
  return (
    <AuthProvider>
      <PriceProvider>
        <RootNavigator />
      </PriceProvider>
    </AuthProvider>
  );
}
