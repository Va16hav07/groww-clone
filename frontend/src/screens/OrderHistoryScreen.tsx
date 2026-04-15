import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { fetchOrders } from "../services/api";

interface OrderHistoryScreenProps {
  onBack: () => void;
}

export default function OrderHistoryScreen({
  onBack,
}: OrderHistoryScreenProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders()
      .then((data) => {
        // Sort orders by most recent
        const sorted = (data.orders || []).sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        setOrders(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F0",
          marginBottom: 10,
        }}
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
        <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 15 }}>
          All Orders
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#00B386"
          style={{ marginTop: 50 }}
        />
      ) : (
        <ScrollView
          style={{ paddingHorizontal: 20, paddingTop: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {orders.length === 0 ? (
            <View style={{ alignItems: "center", marginTop: 80 }}>
              <Text
                style={{ fontSize: 18, color: "#9E9E9E", fontWeight: "500" }}
              >
                No orders yet
              </Text>
              <Text style={{ fontSize: 14, color: "#BDBDBD", marginTop: 8 }}>
                Your order history will appear here.
              </Text>
            </View>
          ) : (
            orders.map((order: any, idx) => {
              const isBuy = order.type === "BUY";
              const statusColor =
                order.status === "EXECUTED"
                  ? "#00B386"
                  : order.status === "FAILED"
                    ? "#F35D5D"
                    : "#FF9800";
              return (
                <View
                  key={order.id || idx}
                  style={{
                    paddingVertical: 18,
                    paddingHorizontal: 15,
                    marginBottom: 15,
                    backgroundColor: "#FFFFFF",
                    borderWidth: 1,
                    borderColor: "#F0F0F0",
                    borderRadius: 12,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    shadowColor: "#000",
                    shadowOpacity: 0.04,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 5,
                    elevation: 3,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        color: "#000",
                        marginBottom: 6,
                      }}
                    >
                      {order.symbol}
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: isBuy ? "#00B386" : "#F35D5D",
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                          backgroundColor: isBuy ? "#E6F7F3" : "#FDECEC",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        {order.type} {order.quantity}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{ alignItems: "flex-end", justifyContent: "center" }}
                  >
                    <Text
                      style={{
                        color: statusColor,
                        fontWeight: "bold",
                        fontSize: 14,
                        marginBottom: 4,
                      }}
                    >
                      {order.status}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#9E9E9E" }}>
                      {new Date(order.created_at).toLocaleDateString()}{" "}
                      {new Date(order.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
