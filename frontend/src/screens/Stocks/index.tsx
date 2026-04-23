import React, { useState, useContext, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../context/AuthContext";
import { PriceContext } from "../../context/PriceContext";
import { fetchPortfolio } from "../../services/api";

import BottomNavBar from "../../components/BottomNavBar";

interface StocksScreenProps {
  onNavigateToProfile?: () => void;
  onNavigateToDetails?: (stock: StockData) => void;
}

interface User {
  name?: string;
}

interface AuthContextType {
  user: User | null;
}

interface StockData {
  symbol: string;
  name: string;
  price: string | number;
  change: string;
}

export default function StocksScreen({
  onNavigateToProfile,
  onNavigateToDetails,
}: StocksScreenProps): React.ReactElement {
  const [textInput1, onChangeTextInput1] = useState<string>("");
  const [currentView, setCurrentView] = useState<"Explore" | "Holdings">("Explore");
  const [holdings, setHoldings] = useState<any[]>([]);
  const { user } = useContext(AuthContext) as AuthContextType;
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";
  const priceContext = useContext(PriceContext);
  
  const prices = priceContext?.prices || {};
  const loadingPrices = priceContext?.loading ?? true;
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);

  useEffect(() => {
    const loadPortfolio = async () => {
      setLoadingPortfolio(true);
      try {
        const res = await fetchPortfolio();
        if (res.success) {
          setHoldings(res.portfolio);
        }
      } catch (error) {
        console.error("Error loading portfolio in StocksScreen:", error);
      } finally {
        setLoadingPortfolio(false);
      }
    };
    loadPortfolio();
  }, []);

  const stockNames: { [key: string]: string } = {
    RELIANCE: "Reliance Industries",
    TCS: "Tata Consultancy Services",
    HDFCBANK: "HDFC Bank",
    INFY: "Infosys Limited",
  };

  const getStockChange = (symbol: string, currentPrice: number): string => {
    if (!currentPrice || !priceContext?.history || !priceContext.history[symbol] || priceContext.history[symbol].length === 0) {
      return "...";
    }
    const history = priceContext.history[symbol];
    const openPrice = history[0].open;
    if (openPrice === 0) return "...";
    const diff = currentPrice - openPrice;
    const percent = (diff / openPrice) * 100;
    const sign = diff >= 0 ? "+" : "";
    return `${sign}${diff.toFixed(2)} (${sign}${percent.toFixed(2)}%)`;
  };

  const getMostBoughtStocks = (): StockData[] => {
    const symbols = ["RELIANCE", "TCS", "HDFCBANK", "INFY"];
    return symbols
      .filter((symbol) => prices[symbol])
      .map((symbol) => ({
        symbol,
        name: stockNames[symbol] || symbol,
        price: prices[symbol],
        change: prices[symbol] ? getStockChange(symbol, Number(prices[symbol])) : "...",
      }));
  };

  const getIndexPrices = () => {
    return {
      nifty50: prices["NIFTY50"] || "24,194.50",
      bankNifty: prices["BANKNIFTY"] || "52,191.50",
    };
  };

  const mostBoughtStocks = getMostBoughtStocks();
  const indexPrices = getIndexPrices();

  return (
    <BottomNavBar onTabChange={(tab) => console.log("Tab changed to:", tab)}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        {(loadingPrices || loadingPortfolio) && (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#059669" />
          </View>
        )}
        {!(loadingPrices || loadingPortfolio) && (
          <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 37,
                marginHorizontal: 30,
                marginTop: 20,
              }}
            >
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/afd3chsl_expires_30_days.png" }}
                resizeMode="stretch"
                style={{ width: 35, height: 35, marginRight: 13 }}
              />
              <Text style={{ color: "#000000", fontSize: 18, fontWeight: "800" }}>Stocks</Text>
              <View style={{ flex: 1 }} />
              <TouchableOpacity>
                <Image
                  source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/u7un6b0g_expires_30_days.png" }}
                  resizeMode="stretch"
                  style={{ width: 24, height: 24, marginRight: 25 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={onNavigateToProfile}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "#059669",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "bold" }}>{userInitial}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 28 }}
              contentContainerStyle={{ flexDirection: "row", paddingHorizontal: 20 }}
            >
              <View
                style={{
                  borderColor: "#E8E8E8",
                  borderRadius: 12,
                  borderWidth: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  marginRight: 12,
                  backgroundColor: "#FAFAFA",
                }}
              >
                <Text style={{ color: "#666", fontSize: 11, marginBottom: 4, fontWeight: "600" }}>NIFTY 50</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: "#000", fontSize: 14, marginRight: 8, fontWeight: "700" }}>{`${indexPrices.nifty50}`}</Text>
                  <Text style={{ color: "#F35D5D", fontSize: 12, fontWeight: "600" }}>-27.40 (0.11%)</Text>
                </View>
              </View>
              <View
                style={{
                  borderColor: "#E8E8E8",
                  borderRadius: 12,
                  borderWidth: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: "#FAFAFA",
                }}
              >
                <Text style={{ color: "#666", fontSize: 11, marginBottom: 4, fontWeight: "600" }}>BANK NIFTY</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: "#000", fontSize: 14, marginRight: 8, fontWeight: "700" }}>{`${indexPrices.bankNifty}`}</Text>
                  <Text style={{ color: "#F35D5D", fontSize: 12, fontWeight: "600" }}>-16.00 (0.03%)</Text>
                </View>
              </View>
            </ScrollView>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 28,
                paddingHorizontal: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => setCurrentView("Explore")}
                style={{
                  flex: 1,
                  alignItems: "center",
                  backgroundColor: currentView === "Explore" ? "#00B386" : "#F9F9F9",
                  borderRadius: 20,
                  paddingVertical: 10,
                  marginRight: 8,
                }}
              >
                <Text style={{ color: currentView === "Explore" ? "#FFF" : "#666", fontSize: 14, fontWeight: "700" }}>Explore</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentView("Holdings")}
                style={{
                  flex: 1,
                  alignItems: "center",
                  backgroundColor: currentView === "Holdings" ? "#00B386" : "#F9F9F9",
                  borderRadius: 20,
                  paddingVertical: 10,
                  marginRight: 8,
                }}
              >
                <Text style={{ color: currentView === "Holdings" ? "#FFF" : "#666", fontSize: 14, fontWeight: "700" }}>Holdings</Text>
              </TouchableOpacity>
            </View>

            {currentView === "Explore" ? (
              <View style={{ marginBottom: 28 }}>
                <Text style={{ color: "#111", fontSize: 20, fontWeight: "800", marginBottom: 20, marginLeft: 20 }}>
                  Most bought on Groww
                </Text>
                <View style={{ paddingHorizontal: 20 }}>
                  {mostBoughtStocks.map((stock) => (
                    <TouchableOpacity
                      key={stock.symbol}
                      onPress={() => onNavigateToDetails && onNavigateToDetails(stock)}
                      style={{
                        borderColor: "#F0F0F0",
                        borderRadius: 16,
                        borderWidth: 1,
                        padding: 16,
                        marginBottom: 12,
                        backgroundColor: "#FFF",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: 2,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <View>
                          <Text style={{ fontSize: 16, fontWeight: "800", color: "#000" }}>
                            {stock.symbol}
                          </Text>
                          <Text style={{ fontSize: 12, color: "#999", marginTop: 2, fontWeight: "600" }}>
                            {stock.name}
                          </Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                          <Text style={{ fontSize: 16, fontWeight: "800", color: "#000" }}>
                            {stock.price ? `₹${stock.price}` : "..."}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: stock.change.includes("-") ? "#F35D5D" : "#00B386",
                              fontWeight: "700",
                              marginTop: 2,
                            }}
                          >
                            {stock.change}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <View style={{ marginBottom: 28 }}>
                {holdings.length > 0 && (
                  <View
                    style={{
                      marginHorizontal: 20,
                      marginBottom: 24,
                      backgroundColor: "#00B386",
                      borderRadius: 20,
                      padding: 20,
                      shadowColor: "#00B386",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.2,
                      shadowRadius: 8,
                      elevation: 5,
                    }}
                  >
                    <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "700", marginBottom: 4 }}>
                      CURRENT VALUE
                    </Text>
                    <Text style={{ color: "#FFF", fontSize: 28, fontWeight: "800", marginBottom: 16 }}>
                      ₹{holdings.reduce((sum, h) => sum + (parseFloat(h.total_quantity) * (prices[h.symbol] || h.average_price || 0)), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: 16 }}>
                      <View>
                        <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: "700", marginBottom: 2 }}>
                          TOTAL SHARES
                        </Text>
                        <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "800" }}>
                          {holdings.reduce((sum, h) => sum + parseInt(h.total_quantity), 0)}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: "700", marginBottom: 2 }}>
                          TOTAL STOCKS
                        </Text>
                        <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "800" }}>
                          {holdings.length}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                <Text style={{ color: "#111", fontSize: 20, fontWeight: "800", marginBottom: 20, marginLeft: 20 }}>
                  Your Holdings
                </Text>
                <View style={{ paddingHorizontal: 20 }}>
                  {holdings.length > 0 ? (
                    holdings.map((holding) => {
                      const currentP = prices[holding.symbol] || holding.average_price || 0;
                      const worth = (parseFloat(holding.total_quantity) * Number(currentP)).toFixed(2);
                      const displayStock = {
                        symbol: holding.symbol,
                        name: stockNames[holding.symbol] || holding.symbol,
                        price: currentP,
                        change: getStockChange(holding.symbol, Number(currentP))
                      };
                      
                      return (
                        <TouchableOpacity
                          key={holding.symbol}
                          onPress={() => onNavigateToDetails && onNavigateToDetails(displayStock)}
                          style={{
                            borderColor: "#F0F0F0",
                            borderRadius: 16,
                            borderWidth: 1,
                            padding: 16,
                            marginBottom: 12,
                            backgroundColor: "#FFF",
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 4,
                            elevation: 2,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <View>
                              <Text style={{ fontSize: 16, fontWeight: "800", color: "#000" }}>
                                {holding.symbol}
                              </Text>
                              <Text style={{ fontSize: 12, color: "#999", marginTop: 4, fontWeight: "600" }}>
                                Qty: {holding.total_quantity}
                              </Text>
                            </View>
                            <View style={{ alignItems: "flex-end" }}>
                              <Text style={{ fontSize: 16, fontWeight: "800", color: "#000" }}>
                                ₹{parseFloat(worth).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: "#666",
                                  fontWeight: "700",
                                  marginTop: 4,
                                }}
                              >
                                Price: ₹{currentP}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })
                  ) : (
                    <View style={{ padding: 40, alignItems: 'center' }}>
                      <Text style={{ color: '#999', fontSize: 16, fontWeight: '600' }}>No holdings yet</Text>
                      <TouchableOpacity onPress={() => setCurrentView('Explore')} style={{ marginTop: 12 }}>
                        <Text style={{ color: '#00B386', fontWeight: '800' }}>Explore Stocks</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </BottomNavBar>
  );
}
