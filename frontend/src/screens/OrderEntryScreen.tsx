import React, { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	Alert,
	ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { createOrder } from "../services/api";

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

	const isBuy = tradeType === "BUY";
	const mainColor = isBuy ? "#00B386" : "#F35D5D";

	const handleExecute = async () => {
		const qty = parseInt(quantity);
		if (isNaN(qty) || qty <= 0) {
			Alert.alert("Invalid input", "Please enter a valid quantity.");
			return;
		}

		setLoading(true);
		try {
			await createOrder(symbol, tradeType, qty, 100);
			setLoading(false);
			Alert.alert(
				"Success",
				`${tradeType} order for ${qty} ${symbol} placed successfully!`,
				[
					{ text: "View Orders", onPress: onNavigateToOrders },
					{ text: "OK", style: "cancel" },
				],
			);
		} catch (error: any) {
			setLoading(false);
			Alert.alert("Error", error.message || `Failed to ${tradeType}`);
		}
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
			<View style={{ flexDirection: "row", alignItems: "center", padding: 20 }}>
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
					{tradeType} {symbol}
				</Text>
			</View>

			<View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
				<Text
					style={{
						fontSize: 16,
						color: "#000",
						marginBottom: 12,
						fontWeight: "600",
					}}
				>
					Quantity NSE
				</Text>
				<TextInput
					style={{
						backgroundColor: "#F9F9F9",
						borderWidth: 1,
						borderColor: "#E8E8E8",
						padding: 15,
						borderRadius: 8,
						fontSize: 18,
						color: "#000",
					}}
					keyboardType="numeric"
					placeholder="Enter quantity"
					value={quantity}
					onChangeText={setQuantity}
					autoFocus
				/>

				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						marginTop: 15,
					}}
				>
					<Text style={{ color: "#757575", fontSize: 14 }}>Type: Market Order</Text>
				</View>
			</View>

			<View
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					padding: 20,
					backgroundColor: "#FFF",
					borderTopWidth: 1,
					borderTopColor: "#F0F0F0",
				}}
			>
				{loading ? (
					<ActivityIndicator size="large" color={mainColor} />
				) : (
					<TouchableOpacity
						onPress={handleExecute}
						style={{
							backgroundColor: mainColor,
							padding: 16,
							borderRadius: 8,
							alignItems: "center",
						}}
					>
						<Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 18 }}>
							{tradeType}
						</Text>
					</TouchableOpacity>
				)}
			</View>
		</SafeAreaView>
	);
}
