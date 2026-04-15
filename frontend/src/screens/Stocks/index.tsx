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
  const { user } = useContext(AuthContext) as AuthContextType;
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";
  const priceContext = useContext(PriceContext);
  
  const prices = priceContext?.prices || {};
  const loading = priceContext?.loading ?? true;

  const stockNames: { [key: string]: string } = {
    RELIANCE: "Reliance",
    TCS: "TCS",
    HDFCBANK: "HDFC Bank",
    INFY: "Infosys",
  };

  const stockChanges: { [key: string]: string } = {
    RELIANCE: "+59.80 (7.83%)",
    TCS: "-255.70 (5.46%)",
    HDFCBANK: "+6.80 (2.49%)",
    INFY: "+31.20 (7.24%)",
  };

  const getMostBoughtStocks = (): StockData[] => {
    const symbols = ["RELIANCE", "TCS", "HDFCBANK", "INFY"];
    return symbols
      .filter((symbol) => prices[symbol])
      .map((symbol) => ({
        symbol,
        name: stockNames[symbol],
        price: prices[symbol],
        change: stockChanges[symbol],
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
        {loading && (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#059669" />
          </View>
        )}
        {!loading && (
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
              <Text style={{ color: "#000000", fontSize: 18 }}>Stocks</Text>
              <View style={{ flex: 1 }} />
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/u7un6b0g_expires_30_days.png" }}
                resizeMode="stretch"
                style={{ width: 26, height: 26, marginRight: 25 }}
              />
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/bfuc1q5o_expires_30_days.png" }}
                resizeMode="stretch"
                style={{ width: 26, height: 26, marginRight: 25 }}
              />
              <TouchableOpacity
                onPress={onNavigateToProfile}
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 17.5,
                  backgroundColor: "#059669",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold" }}>{userInitial}</Text>
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
                  borderRadius: 10,
                  borderWidth: 1,
                  paddingVertical: 15,
                  paddingLeft: 15,
                  paddingRight: 32,
                  marginRight: 15,
                }}
              >
                <Text style={{ color: "#000000", fontSize: 13, marginBottom: 7 }}>NIFTY 50</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: "#000000", fontSize: 13, marginRight: 9 }}>{`${indexPrices.nifty50}`}</Text>
                  <Text style={{ color: "#F35D5D", fontSize: 13, fontWeight: "bold" }}>-27.40 (0.11%)</Text>
                </View>
              </View>
              <View
                style={{
                  borderColor: "#E8E8E8",
                  borderRadius: 10,
                  borderWidth: 1,
                  paddingVertical: 15,
                  paddingLeft: 15,
                  paddingRight: 32,
                }}
              >
                <Text style={{ color: "#000000", fontSize: 13, marginBottom: 7 }}>BANK NIFTY</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ color: "#000000", fontSize: 13, marginRight: 9 }}>{`${indexPrices.bankNifty}`}</Text>
                  <Text style={{ color: "#F35D5D", fontSize: 13, fontWeight: "bold" }}>-16.00 (0.03%)</Text>
                </View>
              </View>
            </ScrollView>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 28,
                marginLeft: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: "center",
                  backgroundColor: "#ECECEC",
                  borderColor: "#000000",
                  borderRadius: 40,
                  borderWidth: 1,
                  paddingVertical: 10,
                  marginRight: 10,
                }}
              >
                <Text style={{ color: "#000000", fontSize: 14 }}>Explore</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: "center",
                  borderColor: "#E8E8E8",
                  borderRadius: 40,
                  borderWidth: 1,
                  paddingVertical: 10,
                  marginRight: 10,
                }}
              >
                <Text style={{ color: "#000000", fontSize: 14 }}>Holdings</Text>
              </TouchableOpacity>
              <TextInput
                placeholder={"Search..."}
                value={textInput1}
                onChangeText={onChangeTextInput1}
                style={{
                  color: "#000000",
                  fontSize: 14,
                  flex: 1,
                  borderColor: "#E8E8E8",
                  borderRadius: 40,
                  borderWidth: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 21,
                  marginRight: 20,
                }}
              />
            </View>

            <View style={{ marginBottom: 28 }}>
              <Text style={{ color: "#000000", fontSize: 18, marginBottom: 24, marginLeft: 21 }}>
                Most bought on Groww
              </Text>
              <View style={{ paddingHorizontal: 20 }}>
                {mostBoughtStocks.map((stock) => (
                  <TouchableOpacity
                    key={stock.symbol}
                    onPress={() => onNavigateToDetails && onNavigateToDetails(stock)}
                    style={{
                      borderColor: "#E8E8E8",
                      borderRadius: 12,
                      borderWidth: 1,
                      padding: 16,
                      marginBottom: 12,
                      backgroundColor: "#FFF",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
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
                        <Text style={{ fontSize: 16, fontWeight: "700", color: "#000" }}>
                          {stock.symbol}
                        </Text>
                        <Text style={{ fontSize: 13, color: "#666", marginTop: 2 }}>
                          {stock.name}
                        </Text>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ fontSize: 16, fontWeight: "600", color: "#000" }}>
                          {stock.price ? `₹${stock.price}` : "..."}
                        </Text>
                        <Text
                          style={{
                            fontSize: 13,
                            color: stock.change.includes("-") ? "#F35D5D" : "#00B386",
                            fontWeight: "600",
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
          </ScrollView>
        )}
      </SafeAreaView>
    </BottomNavBar>
  );
}
