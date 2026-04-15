import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from "react-native";
import { AuthContext, AuthContextType } from "../context/AuthContext";

export default function PinSetupScreen() {
  const { setPin } = useContext(AuthContext) as AuthContextType;
  const [pin, setPinState] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const handlePress = (num: string) => {
    if (isConfirming) {
      if (confirmPin.length < 4) setConfirmPin(confirmPin + num);
    } else {
      if (pin.length < 4) setPinState(pin + num);
    }
  };

  const handleDelete = () => {
    if (isConfirming) {
      setConfirmPin(confirmPin.slice(0, -1));
    } else {
      setPinState(pin.slice(0, -1));
    }
  };

  const handleNext = () => {
    if (pin.length === 4) {
      setIsConfirming(true);
    }
  };

  const handleSubmit = async () => {
    if (pin === confirmPin) {
      await setPin(pin);
    } else {
      Alert.alert("Error", "PINs do not match. Try again.");
      setPinState("");
      setConfirmPin("");
      setIsConfirming(false);
    }
  };

  const currentPin = isConfirming ? confirmPin : pin;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>
        <Text style={styles.title}>{isConfirming ? "Confirm PIN" : "Set up PIN"}</Text>
        <Text style={styles.subtitle}>
          {isConfirming ? "Re-enter your 4-digit PIN to confirm" : "Create a 4-digit PIN for secure access to Groww"}
        </Text>
      </View>

      <View style={styles.pinContainer}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[
              styles.dot,
              currentPin.length >= i && styles.dotFilled
            ]}
          />
        ))}
      </View>

      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "X"].map((val, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.key,
              (val === "" || val === "X") && styles.specialKey
            ]}
            onPress={() => {
              if (val === "X") handleDelete();
              else if (val !== "") handlePress(val.toString());
            }}
          >
            {val === "X" ? (
              <Text style={styles.deleteText}>⌫</Text>
            ) : (
              <Text style={styles.keyText}>{val}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          currentPin.length < 4 && styles.buttonDisabled
        ]}
        disabled={currentPin.length < 4}
        onPress={isConfirming ? handleSubmit : handleNext}
      >
        <Text style={styles.buttonText}>{isConfirming ? "Confirm & Secure" : "Next"}</Text>
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
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  lockIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 20,
    fontWeight: "500",
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
  button: {
    backgroundColor: "#059669",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#F0F0F0",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
