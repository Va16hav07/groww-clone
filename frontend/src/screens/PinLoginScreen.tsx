import React, { useState, useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Image } from "react-native";
import { AuthContext, AuthContextType } from "../context/AuthContext";

export default function PinLoginScreen() {
  const { verifyPin, authenticateWithBiometrics, user, logout } = useContext(AuthContext) as AuthContextType;
  const [pin, setPin] = useState("");

  useEffect(() => {
    // Attempt biometrics on mount
    handleBiometricAuth();
  }, []);

  const handleBiometricAuth = async () => {
    const success = await authenticateWithBiometrics();
    if (success) {
      // Unlocked
    }
  };

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        handleVerify(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleVerify = async (enteredPin: string) => {
    const success = await verifyPin(enteredPin);
    if (!success) {
      Alert.alert("Incorrect PIN", "The PIN you entered is incorrect. Please try again.");
      setPin("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profilePic}>
          <Text style={styles.profileInitial}>{user?.name?.charAt(0).toUpperCase() || "U"}</Text>
        </View>
        <Text style={styles.title}>Welcome back,</Text>
        <Text style={styles.userName}>{user?.name || "User"}</Text>
        <Text style={styles.subtitle}>Enter your PIN to unlock and trade</Text>
      </View>

      <View style={styles.pinContainer}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              pin.length >= i && styles.dotFilled
            ]}
          />
        ))}
      </View>

      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "BIO", 0, "X"].map((val, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.key,
              (val === "BIO" || val === "X" || val === "") && styles.specialKey
            ]}
            onPress={() => {
              if (val === "X") handleDelete();
              else if (val === "BIO") handleBiometricAuth();
              else if (val !== "") handlePress(val.toString());
            }}
          >
            {val === "BIO" ? (
              <Image 
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/f8rbj579_expires_30_days.png" }} 
                style={{ width: 28, height: 28, tintColor: "#059669" }}
              />
            ) : val === "X" ? (
              <Text style={styles.deleteText}>⌫</Text>
            ) : (
              <Text style={styles.keyText}>{val}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Switch Account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E9FAF2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  profileInitial: {
    fontSize: 32,
    fontWeight: "800",
    color: "#059669",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
    fontWeight: "600",
  },
  pinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginVertical: 40,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#F0F0F0",
    backgroundColor: "#F9F9F9",
  },
  dotFilled: {
    backgroundColor: "#059669",
    borderColor: "#059669",
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  key: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    justifyContent: "center",
    alignItems: "center",
    margin: 12,
    backgroundColor: "#F9F9F9",
  },
  specialKey: {
    backgroundColor: "transparent",
  },
  keyText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111",
  },
  deleteText: {
    fontSize: 22,
    color: "#666",
  },
  logoutButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#059669",
    fontSize: 15,
    fontWeight: "700",
  },
});
