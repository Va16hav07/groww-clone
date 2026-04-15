import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, LinearGradient, Stop, Defs } from "react-native-svg";
import { PriceContext, OHLC } from "../context/PriceContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface StockDetailsScreenProps {
  stock: any;
  onBack: () => void;
  onNavigateToEntry: (type: "BUY" | "SELL") => void;
}

const CandleChart = ({ data, color }: { data: OHLC[]; color: string }) => {
  if (!data || data.length === 0) return null;

  const chartHeight = 220;
  const chartWidth = SCREEN_WIDTH - 40;
  const candlePadding = 4;
  const candleWidth = (chartWidth / Math.max(data.length, 20)) - candlePadding;

  const minPrice = Math.min(...data.map((d) => d.low)) * 0.999;
  const maxPrice = Math.max(...data.map((d) => d.high)) * 1.001;
  const priceRange = maxPrice - minPrice;

  const getY = (price: number) => {
    return chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  };

  return (
    <View style={{ height: chartHeight, width: chartWidth, alignSelf: "center", marginVertical: 20 }}>
      <Svg width={chartWidth} height={chartHeight}>
        {data.map((candle, index) => {
          const x = index * (candleWidth + candlePadding);
          const openY = getY(candle.open);
          const closeY = getY(candle.close);
          const highY = getY(candle.high);
          const lowY = getY(candle.low);
          
          const isBullish = candle.close >= candle.open;
          const candleColor = isBullish ? "#00B386" : "#F35D5D";
          
          return (
            <React.Fragment key={candle.timestamp}>
              {/* Wick */}
              <Path
                d={`M${x + candleWidth / 2} ${highY} L${x + candleWidth / 2} ${lowY}`}
                stroke={candleColor}
                strokeWidth="1.5"
              />
              {/* Body */}
              <Path
                d={`M${x} ${Math.min(openY, closeY)} L${x + candleWidth} ${Math.min(openY, closeY)} L${x + candleWidth} ${Math.max(openY, closeY)} L${x} ${Math.max(openY, closeY)} Z`}
                fill={candleColor}
              />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

export default function StockDetailsScreen({
  stock,
  onBack,
  onNavigateToEntry,
}: StockDetailsScreenProps) {
  const [activeTab, setActiveTab] = useState("1D");
  const priceContext = useContext(PriceContext);
  const currentPrice = priceContext?.prices[stock.symbol] || stock.price;
  const history = priceContext?.history[stock.symbol] || [];
  
  const isNegative = stock.change?.includes("-");
  const accentColor = isNegative ? "#F35D5D" : "#00B386";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
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
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "800", color: "#111" }}>
            {stock.symbol}
          </Text>
          <Text style={{ fontSize: 12, color: "#666", fontWeight: "500" }}>
            {stock.name}
          </Text>
        </View>
        <View style={{ width: 34 }} /> 
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Price Section */}
        <View style={{ paddingHorizontal: 20, marginTop: 24, marginBottom: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <Text style={{ fontSize: 42, fontWeight: "900", color: "#000" }}>
              ₹{currentPrice}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
            <View
              style={{
                backgroundColor: isNegative ? "rgba(243, 93, 93, 0.1)" : "rgba(0, 179, 134, 0.1)",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
                marginRight: 8,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "700", color: accentColor }}>
                {stock.change}
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: "#666", fontWeight: "500" }}>
              Today
            </Text>
          </View>
        </View>

        {/* Candle Chart Section */}
        <CandleChart data={history} color={accentColor} />

        {/* Timeframe Selectors */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 15,
            marginBottom: 35,
          }}
        >
          {["1D", "1W", "1M", "1Y", "5Y", "ALL"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: activeTab === tab ? "#F0F0F0" : "transparent",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: activeTab === tab ? "800" : "600",
                  color: activeTab === tab ? "#000" : "#999",
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Section */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "800", color: "#111", marginBottom: 16 }}>
            Market Stats
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
            {[
              { label: "Open", value: "₹" + (currentPrice * 0.98).toFixed(2) },
              { label: "Prev. Close", value: "₹" + (currentPrice * 1.01).toFixed(2) },
              { label: "Day's High", value: "₹" + (currentPrice * 1.02).toFixed(2) },
              { label: "Day's Low", value: "₹" + (currentPrice * 0.97).toFixed(2) },
              { label: "Market Cap", value: "₹12.4T" },
              { label: "P/E Ratio", value: "24.5" },
            ].map((stat, i) => (
              <View
                key={i}
                style={{
                  width: "48%",
                  backgroundColor: "#F9F9F9",
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 12,
                }}
              >
                <Text style={{ fontSize: 12, color: "#777", fontWeight: "600", marginBottom: 4 }}>
                  {stat.label}
                </Text>
                <Text style={{ fontSize: 15, color: "#111", fontWeight: "800" }}>
                  {stat.value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Buy/Sell Footer */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#FFF",
          paddingHorizontal: 20,
          paddingTop: 15,
          paddingBottom: 35,
          flexDirection: "row",
          borderTopWidth: 1,
          borderTopColor: "#EEE",
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: -5 },
          shadowRadius: 10,
          elevation: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => onNavigateToEntry("SELL")}
          style={{
            flex: 1,
            backgroundColor: "#FFF",
            height: 56,
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: "#F35D5D",
            marginRight: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#F35D5D", fontWeight: "800", fontSize: 16 }}>
            SELL
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onNavigateToEntry("BUY")}
          style={{
            flex: 1,
            backgroundColor: "#00B386",
            height: 56,
            borderRadius: 14,
            marginLeft: 10,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#00B386",
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 8,
          }}
        >
          <Text style={{ color: "#FFF", fontWeight: "800", fontSize: 16 }}>
            BUY
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
