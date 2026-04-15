import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { createOrder } from "../services/api";
import { PriceContext } from "../context/PriceContext";

interface OrderEntryScreenProps {
  symbol: string;
  tradeType: "BUY" | "SELL";
  onBack: () => void;
  onNavigateToOrders: () => void;
}

export default function OrderEntryScreen({
  symbol,
  tradeType,
  onBack,
  onNavigateToOrders,
}: OrderEntryScreenProps) {
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(false);
  const priceContext = useContext(PriceContext);
  const currentPrice = priceContext?.prices[symbol] || 0;

  const isBuy = tradeType === "BUY";
  const mainColor = isBuy ? "#00B386" : "#F35D5D";

  const numQuantity = parseInt(quantity) || 0;
  const totalPrice = (numQuantity * Number(currentPrice)).toFixed(2);

  const handleExecute = async () => {
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert("Invalid input", "Please enter a valid quantity.");
      return;
    }

    setLoading(true);
    try {
      await createOrder(symbol, tradeType, qty, Number(currentPrice));
      setLoading(false);
      Alert.alert(
        "Order Successful",
        `${tradeType} order for ${qty} shares of ${symbol} has been executed at ₹${currentPrice}.`,
        [
          { text: "View Portfolio", onPress: onNavigateToOrders },
          { text: "OK", style: "cancel" },
        ],
      );
    } catch (error: any) {
      setLoading(false);
      Alert.alert("Order Failed", error.message || `Failed to ${tradeType} stock.`);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 15,
                borderBottomWidth: 1,
                borderBottomColor: "#F5F5F5",
              }}
            >
              <TouchableOpacity onPress={onBack} style={{ padding: 5 }}>
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M15 18L9 12L15 6"
                    stroke="#111"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
              <View style={{ marginLeft: 15 }}>
                <Text style={{ fontSize: 18, fontWeight: "800", color: "#111" }}>
                  {tradeType === "BUY" ? "Buying" : "Selling"} {symbol}
                </Text>
                <Text style={{ fontSize: 12, color: "#666", fontWeight: "600" }}>
                  NSE • Market Order
                </Text>
              </View>
            </View>

            {/* Input Section */}
            <View style={{ padding: 24 }}>
              <View
                style={{
                  backgroundColor: "#F9F9F9",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "#F0F0F0",
                }}
              >
                <Text style={{ fontSize: 14, color: "#777", fontWeight: "700", marginBottom: 12 }}>
                  QUANTITY
                </Text>
                <TextInput
                  style={{
                    fontSize: 32,
                    fontWeight: "800",
                    color: "#000",
                    padding: 0,
                  }}
                  keyboardType="numeric"
                  placeholder="0"
                  value={quantity}
                  onChangeText={setQuantity}
                  autoFocus
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 24,
                  paddingHorizontal: 4,
                }}
              >
                <View>
                  <Text style={{ fontSize: 13, color: "#999", fontWeight: "600", marginBottom: 4 }}>
                    Price NSE
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: "800", color: "#000" }}>
                    ₹{currentPrice}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 13, color: "#999", fontWeight: "600", marginBottom: 4 }}>
                    Total Order Value
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: "800", color: mainColor }}>
                    ₹{totalPrice}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ flex: 1 }} />

            {/* Footer Summary & Button */}
            <View
              style={{
                padding: 24,
                backgroundColor: "#FFF",
                borderTopWidth: 1,
                borderTopColor: "#F5F5F5",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <Text style={{ fontSize: 14, color: "#666", fontWeight: "600" }}>
                  Wallet Balance
                </Text>
                <Text style={{ fontSize: 14, color: "#111", fontWeight: "800" }}>
                  ₹24,500.00
                </Text>
              </View>

              {loading ? (
                <View style={{ height: 56, justifyContent: "center" }}>
                  <ActivityIndicator size="large" color={mainColor} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleExecute}
                  style={{
                    backgroundColor: mainColor,
                    height: 56,
                    borderRadius: 14,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: mainColor,
                    shadowOpacity: 0.3,
                    shadowOffset: { width: 0, height: 4 },
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Text style={{ color: "#FFF", fontWeight: "800", fontSize: 18 }}>
                    {tradeType === "BUY" ? "CONFIRM BUY" : "CONFIRM SELL"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
