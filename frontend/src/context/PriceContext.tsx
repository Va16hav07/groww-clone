import React, { createContext, useState, useEffect, ReactNode } from "react";
import EventSource from "react-native-sse";
import { fetchPricesHistory } from "../services/api";

export interface OHLC {
  open: number;
  high: number;
  low: number;
  close: number;
  timestamp: number;
}

interface PriceData {
  [key: string]: string | number;
}

interface PriceContextType {
  prices: PriceData;
  history: Record<string, OHLC[]>;
  loading: boolean;
}

export const PriceContext = createContext<PriceContextType | undefined>(undefined);

export const PriceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<PriceData>({});
  const [history, setHistory] = useState<Record<string, OHLC[]>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let eventSource: InstanceType<typeof EventSource> | null = null;

    const fetchHistoryAndConnect = async () => {
      try {
        const data = await fetchPricesHistory();
        if (data.history) {
          setHistory(data.history);
        }
      } catch (err) {
        console.error("Error fetching initial history", err);
      }
      connectToStream();
    };

    const connectToStream = () => {
      try {
        const apiUrl =
          process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api";
        eventSource = new EventSource(`${apiUrl}/prices/stream`);

        eventSource.addEventListener("message", (event) => {
          try {
            if (event.data) {
              const data = JSON.parse(event.data);
              
              setPrices((prevPrices) => ({ ...prevPrices, ...data }));
              
              setHistory((prevHistory) => {
                const newHistory = { ...prevHistory };
                
                Object.entries(data).forEach(([symbol, price]) => {
                  const currentPrice = typeof price === 'string' ? parseFloat(price.replace(/,/g, '')) : Number(price);
                  if (isNaN(currentPrice)) return;

                  const stockHistory = newHistory[symbol] || [];
                  const lastCandle = stockHistory[stockHistory.length - 1];
                  const now = Date.now();
                  
                  // If no candle or last candle is older than 10 seconds, create new
                  if (!lastCandle || (now - lastCandle.timestamp) > 10000) {
                    const newCandle: OHLC = {
                      open: lastCandle ? lastCandle.close : currentPrice,
                      high: Math.max(lastCandle ? lastCandle.close : currentPrice, currentPrice),
                      low: Math.min(lastCandle ? lastCandle.close : currentPrice, currentPrice),
                      close: currentPrice,
                      timestamp: now,
                    };
                    newHistory[symbol] = [...stockHistory, newCandle].slice(-40); // Keep last 40 candles
                  } else {
                    // Update current candle
                    lastCandle.close = currentPrice;
                    lastCandle.high = Math.max(lastCandle.high, currentPrice);
                    lastCandle.low = Math.min(lastCandle.low, currentPrice);
                    newHistory[symbol] = [...stockHistory];
                  }
                });
                
                return newHistory;
              });

              setLoading(false);
            }
          } catch (error) {
            console.error("Error parsing price data in PriceContext:", error);
          }
        });

        eventSource.addEventListener("error", (error) => {
          console.log("SSE Connection Error", error);
          eventSource?.close();
          setTimeout(connectToStream, 3000);
        });
      } catch (error) {
        console.error("SSE Initialization Error", error);
        setLoading(false);
      }
    };

    fetchHistoryAndConnect();

    return () => {
      eventSource?.close();
    };
  }, []);

  return (
    <PriceContext.Provider value={{ prices, history, loading }}>
      {children}
    </PriceContext.Provider>
  );
};
