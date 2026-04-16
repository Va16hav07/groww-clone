import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";

interface LoginScreenProps {
  onNavigateToSignup: () => void;
}

interface LoginResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  login: (email: string, password: string) => Promise<LoginResult>;
}

export default function LoginScreen({
  onNavigateToSignup,
}: LoginScreenProps): React.ReactElement {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  const { login } = useContext(AuthContext) as AuthContextType;

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      setErrorText("Please fill in all fields");
      return;
    }
    setErrorText("");
    setIsSubmitting(true);
    const result = await login(email, password);
    if (!result.success) {
      setErrorText(result.error || "Login failed");
    }
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-16 pb-8 justify-center">
          {/* Logo & Header */}
          <View className="items-center mb-10 mt-10">
            <View className="w-24 h-24 mb-6">
              <Image
                source={require("../../assets/logo.png")}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
            <Text className="text-3xl font-extrabold text-gray-900 mb-2">
              Welcome to Groww
            </Text>
            <Text className="text-gray-500 text-base text-center px-4">
              Invest in Stocks, Mutual Funds, and more.
            </Text>
          </View>

          {/* Form */}
          <View className="mb-4 w-full">
            <Text className="text-gray-700 font-semibold mb-2 ml-1">
              Email Address
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-14 bg-gray-50">
              <Ionicons
                name="mail-outline"
                size={20}
                color="#9ca3af"
                className="mr-3"
              />
              <TextInput
                className="flex-1 h-full text-gray-900 text-base ml-2"
                placeholder="name@example.com"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View className="mb-6 w-full">
            <Text className="text-gray-700 font-semibold mb-2 ml-1">
              Password
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-14 bg-gray-50">
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#9ca3af"
                className="mr-3"
              />
              <TextInput
                className="flex-1 h-full text-gray-900 text-base ml-2"
                placeholder="Enter password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          {/* Error Message */}
          {errorText ? (
            <Text className="text-red-500 font-medium mb-4 ml-1 px-1">
              {errorText}
            </Text>
          ) : null}

          {/* Action Button */}
          <TouchableOpacity
            className="bg-emerald-600 h-14 rounded-xl flex-row items-center justify-center shadow-md w-full"
            activeOpacity={0.8}
            onPress={handleLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-lg">Continue</Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View className="items-center mt-auto mb-4">
            <View className="flex-row mb-4">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity onPress={onNavigateToSignup}>
                <Text className="text-emerald-600 font-bold">Sign up</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-center text-gray-500 text-sm">
              By continuing, you accept our{" "}
              <Text className="text-emerald-600 font-medium">Terms</Text> and{" "}
              <Text className="text-emerald-600 font-medium">
                Privacy Policy
              </Text>
              .
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
