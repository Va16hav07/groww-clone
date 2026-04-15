import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

export const fetchWithAuth = async (endpoint: string, options: any = {}) => {
  const token = await SecureStore.getItemAsync('userToken');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
};

export const fetchPortfolio = async () => {
  return await fetchWithAuth('/portfolio');
};

export const fetchOrders = async () => {
  return await fetchWithAuth('/orders');
};

export const createOrder = async (symbol: string, type: string, quantity: number, price: number) => {
  return await fetchWithAuth('/orders', {
    method: 'POST',
    body: JSON.stringify({ symbol, type, quantity, price })
  });
};
