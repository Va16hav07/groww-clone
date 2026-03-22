import React, { useState, ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path, Rect, Circle } from "react-native-svg";

interface BottomTabBarProps {
  onTabChange?: (tab: string) => void;
  initialTab?: string;
  children?: ReactNode;
}

// Stocks icon (trending arrow chart)
const StocksIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 17L8 11L12 14L17 8L21 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 8H21V12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Mutual Funds icon (two squares / grid like in screenshot)
const MutualFundsIcon = ({ color }: { color: string }) => (
  <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <Rect x="3" y="3" width="10" height="10" rx="2" fill={color} />
    <Rect x="15" y="3" width="10" height="10" rx="2" fill={color} />
    <Rect x="3" y="15" width="10" height="10" rx="2" fill={color} />
    <Rect x="15" y="15" width="10" height="10" rx="2" fill={color} />
  </Svg>
);

// UPI icon (play button triangle)
const UPIIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 4L20 12L6 20V4Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function BottomNavBar({
  onTabChange,
  initialTab = "Stocks",
  children,
}: BottomTabBarProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const tabs = [
    { key: "Stocks", label: "Stocks", Icon: StocksIcon },
    { key: "MutualFunds", label: "Mutual Funds", Icon: MutualFundsIcon },
    { key: "UPI", label: "UPI", Icon: UPIIcon },
  ];

  const renderContent = () => {
    if (activeTab === "Stocks") {
      return (
        <View style={styles.contentContainer}>
          {children}
        </View>
      );
    }

    return (
      <View style={styles.comingSoonContainer}>
        <Text style={styles.comingSoonText}>Coming Soon</Text>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentWrapper}>
        {renderContent()}
      </View>

      <View style={styles.container}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const color = isActive ? "#5367FF" : "#9E9E9E";

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              onPress={() => handleTabPress(tab.key)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                <tab.Icon color={color} />
              </View>
              <Text style={[styles.label, { color }]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentWrapper: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  comingSoonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  comingSoonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9E9E9E",
  },
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 10,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  iconWrapper: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
});
