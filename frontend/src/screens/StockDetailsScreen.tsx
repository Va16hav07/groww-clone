import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

interface StockDetailsScreenProps {
  stock: any;
  onBack: () => void;
  onNavigateToEntry: (type: "BUY" | "SELL") => void;
}

export default function StockDetailsScreen({
  stock,
  onBack,
  onNavigateToEntry,
}: StockDetailsScreenProps) {
  const [activeTab, setActiveTab] = useState("1D");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Section */}
        <View
          style={{ flexDirection: "row", alignItems: "center", padding: 20 }}
        >
          <TouchableOpacity
            onPress={onBack}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 18L9 12L15 6"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 15 }}>
            {stock.symbol}
          </Text>
        </View>

        {/* Price Info Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 36, fontWeight: "bold", color: "#000000" }}>
            {stock.price ? `${stock.price}` : "..."}
          </Text>
          <Text style={{ fontSize: 16, color: stock.change?.includes("-") ? "#F35D5D" : "#059669", marginTop: 4 }}>
            {stock.change || ""}
          </Text>
        </View>

        {/* Fake Chart Section */}
        <View
          style={{
            height: 250,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Svg width="100%" height="200" viewBox="0 0 400 200" fill="none">
            <Path
              d="M0 180 L50 150 L100 120 L150 140 L200 90 L250 110 L300 40 L350 60 L400 20 L400 200 L0 200 Z"
              fill="#00B386"
              fillOpacity={0.1}
            />
            <Path
              d="M0 180 L50 150 L100 120 L150 140 L200 90 L250 110 L300 40 L350 60 L400 20"
              stroke="#00B386"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>

        {/* Timeframe Tabs */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginHorizontal: 20,
            borderTopWidth: 1,
            borderTopColor: "#F0F0F0",
            paddingTop: 15,
            marginBottom: 30,
          }}
        >
          {["1D", "1W", "1M", "1Y", "ALL"].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: activeTab === tab ? "bold" : "normal",
                  color: activeTab === tab ? "#00B386" : "#9E9E9E",
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#FFF",
          padding: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -4 },
          shadowRadius: 10,
          elevation: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => onNavigateToEntry("SELL")}
          style={{
            flex: 1,
            backgroundColor: "#F35D5D",
            padding: 16,
            borderRadius: 8,
            marginRight: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 16 }}>
            SELL
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onNavigateToEntry("BUY")}
          style={{
            flex: 1,
            backgroundColor: "#00B386",
            padding: 16,
            borderRadius: 8,
            marginLeft: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 16 }}>
            BUY
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
