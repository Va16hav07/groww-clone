import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";

interface SignupScreenProps {
  onNavigateToLogin: () => void;
}

interface SignupResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  signup: (
    name: string,
    email: string,
    password: string,
  ) => Promise<SignupResult>;
}

export default function SignupScreen({
  onNavigateToLogin,
}: SignupScreenProps): React.ReactElement {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  const { signup } = useContext(AuthContext) as AuthContextType;

  const handleSignup = async (): Promise<void> => {
    if (!name || !email || !password) {
      setErrorText("Please fill in all fields");
      return;
    }
    setErrorText("");
    setIsSubmitting(true);
    const result = await signup(name, email, password);
    if (!result.success) {
      setErrorText(result.error || "Signup failed");
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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="flex-1 px-6 pt-10 pb-8"
        >
          {/* Back Button */}
          <TouchableOpacity
            onPress={onNavigateToLogin}
            className="w-10 h-10 justify-center mb-2 mt-4"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>

          {/* Header */}
          <View className="mb-6">
            <View className="w-16 h-16 mb-4">
              <Image
                source={require("../../assets/logo.png")}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
            <Text className="text-3xl font-extrabold text-gray-900 mb-2">
              Create Account
            </Text>
            <Text className="text-gray-500 text-base">
              Start your investment journey today.
            </Text>
          </View>

          {/* Form */}
          <View className="mb-4 w-full">
            <Text className="text-gray-700 font-semibold mb-2 ml-1">
              Full Name
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-14 bg-gray-50">
              <Ionicons
                name="person-outline"
                size={20}
                color="#9ca3af"
                className="mr-3"
              />
              <TextInput
                className="flex-1 h-full text-gray-900 text-base ml-2"
                placeholder="John Doe"
                placeholderTextColor="#9ca3af"
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

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

          <View className="mb-8 w-full">
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
                placeholder="Required"
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
            onPress={handleSignup}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-lg">Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View className="items-center mt-auto pt-10 mb-4">
            <View className="flex-row mb-4">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={onNavigateToLogin}>
                <Text className="text-emerald-600 font-bold">Log in</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-center text-gray-500 text-sm">
              By signing up, you accept our{" "}
              <Text className="text-emerald-600 font-medium">Terms</Text> and{" "}
              <Text className="text-emerald-600 font-medium">
                Privacy Policy
              </Text>
              .
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
