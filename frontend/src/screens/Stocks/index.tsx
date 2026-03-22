import React, { useState, useContext, useEffect } from "react";
import { View, ScrollView, Image, Text, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../context/AuthContext";
import { fetchWithAuth } from "../../services/api";
import EventSource from "react-native-sse";
import BottomNavBar from "../../components/BottomNavBar";

interface StocksScreenProps {
  onNavigateToProfile?: () => void;
}

interface User {
  name?: string;
}

interface AuthContextType {
  user: User | null;
}

interface PriceData {
  [key: string]: string | number;
}

interface StockData {
  symbol: string;
  name: string;
  price: string | number;
  change: string;
}

export default function StocksScreen({ onNavigateToProfile }: StocksScreenProps): React.ReactElement {
	const [textInput1, onChangeTextInput1] = useState<string>('');
	const { user } = useContext(AuthContext) as AuthContextType;
	const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';
	const [prices, setPrices] = useState<PriceData>({});
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		let eventSource: InstanceType<typeof EventSource> | null = null;

		const connectToStream = () => {
			try {
				const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';
				console.log(`Connecting to: ${apiUrl}/prices/stream`);
				eventSource = new EventSource(`${apiUrl}/prices/stream`);

				eventSource.addEventListener("message", (event) => {
					try {
						console.log('Received event:', event.data);
						if (event.data) {
							const data = JSON.parse(event.data);
							console.log('Parsed prices:', data);
							setPrices(data);
							setLoading(false);
						}
					} catch (error) {
						console.error('Error parsing price data:', error);
					}
				});

				eventSource.addEventListener("error", (error) => {
					console.error('EventSource error:', error);
					eventSource?.close();
					// Reconnect after 3 seconds
					setTimeout(connectToStream, 3000);
				});

			} catch (error) {
				console.error('Error connecting to price stream:', error);
				setLoading(false);
			}
		};

		connectToStream();

		return () => {
			eventSource?.close();
		};
	}, []);

	const stockNames: { [key: string]: string } = {
		'RELIANCE': 'Reliance',
		'TCS': 'TCS',
		'HDFCBANK': 'HDFC Bank',
		'INFY': 'Infosys'
	};

	const stockChanges: { [key: string]: string } = {
		'RELIANCE': '+59.80 (7.83%)',
		'TCS': '-255.70 (5.46%)',
		'HDFCBANK': '+6.80 (2.49%)',
		'INFY': '+31.20 (7.24%)'
	};

	const getMostBoughtStocks = (): StockData[] => {
		const symbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY'];
		return symbols
			.filter(symbol => prices[symbol])
			.map(symbol => ({
				symbol,
				name: stockNames[symbol],
				price: prices[symbol],
				change: stockChanges[symbol]
			}));
	};

	const getIndexPrices = () => {
		return {
			nifty50: prices['NIFTY50'] || '24,194.50',
			bankNifty: prices['BANKNIFTY'] || '52,191.50'
		};
	};

	const mostBoughtStocks = getMostBoughtStocks();
	const indexPrices = getIndexPrices();

	return (
		<BottomNavBar onTabChange={(tab) => console.log('Tab changed to:', tab)}>
			<SafeAreaView 
				style={{
					flex: 1,
					backgroundColor: "#FFFFFF",
				}}>
				{loading && (
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<ActivityIndicator size="large" color="#059669" />
					</View>
				)}
				{!loading && (
				<ScrollView  
					style={{
						flex: 1,
						backgroundColor: "#FFFFFF",
					}}>
				<View 
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginBottom: 37,
						marginHorizontal: 30,
						marginTop: 20,
					}}>
					<Image
						source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/afd3chsl_expires_30_days.png"}} 
						resizeMode = {"stretch"}
						style={{
							width: 35,
							height: 35,
							marginRight: 13,
						}}
					/>
					<Text 
						style={{
							color: "#000000",
							fontSize: 18,
						}}>
						{"Stocks"}
					</Text>
					<View 
						style={{
							flex: 1,
						}}>
					</View>
					<Image
						source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/u7un6b0g_expires_30_days.png"}} 
						resizeMode = {"stretch"}
						style={{
							width: 26,
							height: 26,
							marginRight: 25,
						}}
					/>
					<Image
						source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/bfuc1q5o_expires_30_days.png"}} 
						resizeMode = {"stretch"}
						style={{
							width: 26,
							height: 26,
							marginRight: 25,
						}}
					/>
					<TouchableOpacity 
						onPress={onNavigateToProfile}
						style={{
							width: 35,
							height: 35,
							borderRadius: 17.5,
							backgroundColor: "#059669",
							justifyContent: "center",
							alignItems: "center",
						}}>
						<Text 
							style={{
								color: "#FFFFFF",
								fontSize: 16,
								fontWeight: "bold",
							}}>
							{userInitial}
						</Text>
					</TouchableOpacity>
				</View>
				<ScrollView 
					horizontal
					showsHorizontalScrollIndicator={false} 
					style={{
						flexDirection: "row",
						marginBottom: 28,
					}}>
					<View 
						style={{
							borderColor: "#E8E8E8",
							borderRadius: 10,
							borderWidth: 1,
							paddingVertical: 15,
							paddingLeft: 15,
							paddingRight: 32,
							marginLeft: 21,
							marginRight: -361,
						}}>
						<Text 
							style={{
								color: "#000000",
								fontSize: 13,
								marginBottom: 7,
							}}>
							{"NIFTY 50"}
						</Text>
						<View 
							style={{
								alignSelf: "flex-start",
								flexDirection: "row",
								alignItems: "center",
							}}>
							<Text 
								style={{
									color: "#000000",
									fontSize: 13,
									marginRight: 9,
								}}>
								{`${indexPrices.nifty50}`}
							</Text>
							<Text 
								style={{
									color: "#F35D5D",
									fontSize: 13,
									fontWeight: "bold",
								}}>
								{"-27.40 (0.11%)"}
							</Text>
						</View>
					</View>
					<View 
						style={{
							borderColor: "#E8E8E8",
							borderRadius: 10,
							borderWidth: 1,
							paddingVertical: 15,
							paddingLeft: 15,
							paddingRight: 32,
						}}>
						<Text 
							style={{
								color: "#000000",
								fontSize: 13,
								marginBottom: 7,
							}}>
							{"BANK NIFTY"}
						</Text>
						<View 
							style={{
								alignSelf: "flex-start",
								flexDirection: "row",
								alignItems: "center",
							}}>
							<Text 
								style={{
									color: "#000000",
									fontSize: 13,
									marginRight: 9,
								}}>
								{`${indexPrices.bankNifty}`}
							</Text>
							<Text 
								style={{
									color: "#F35D5D",
									fontSize: 13,
									fontWeight: "bold",
								}}>
								{"-16.00 (0.03%)"}
							</Text>
						</View>
					</View>
				</ScrollView>
				<View 
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginBottom: 28,
						marginLeft: 20,
					}}>
					<TouchableOpacity 
						style={{
							flex: 1,
							alignItems: "center",
							backgroundColor: "#ECECEC",
							borderColor: "#000000",
							borderRadius: 40,
							borderWidth: 1,
							paddingVertical: 10,
							marginRight: 10,
						}} onPress={()=>alert('Pressed!')}>
						<Text 
							style={{
								color: "#000000",
								fontSize: 14,
							}}>
							{"Explore"}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity 
						style={{
							flex: 1,
							alignItems: "center",
							borderColor: "#E8E8E8",
							borderRadius: 40,
							borderWidth: 1,
							paddingVertical: 10,
							marginRight: 10,
						}} onPress={()=>alert('Pressed!')}>
						<Text 
							style={{
								color: "#000000",
								fontSize: 14,
							}}>
							{"Holdings"}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity 
						style={{
							borderColor: "#E8E8E8",
							borderRadius: 40,
							borderWidth: 1,
							paddingVertical: 10,
							paddingHorizontal: 19,
							marginRight: 10,
						}} onPress={()=>alert('Pressed!')}>
						<Text 
							style={{
								color: "#000000",
								fontSize: 14,
							}}>
							{"ETF"}
						</Text>
					</TouchableOpacity>
					<TextInput
						placeholder={"Road Construction"}
						value={textInput1}
						onChangeText={onChangeTextInput1}
						style={{
							color: "#000000",
							fontSize: 14,
							flex: 1,
							borderColor: "#E8E8E8",
							borderRadius: 40,
							borderWidth: 1,
							paddingVertical: 10,
							paddingHorizontal: 21,
						}}
					/>
				</View>
				<View 
					style={{
						marginBottom: 28,
						marginHorizontal: 20,
					}}>
					<Text 
						style={{
							color: "#000000",
							fontSize: 18,
							marginBottom: 24,
							marginLeft: 1,
						}}>
						{"Most bought on Groww"}
					</Text>
					<View >
						<View 
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 24,
							}}>
							<View 
								style={{
									flex: 1,
									borderColor: "#E8E8E8",
									borderRadius: 10,
									borderWidth: 1,
									paddingVertical: 28,
									marginRight: 20,
								}}>
								<Image
									source = {require('../../../assets/relaince.png')} 
									resizeMode = {"stretch"}
									style={{
										borderRadius: 10,
										width: 34,
										height: 15,
										marginBottom: 15,
										marginLeft: 15,
									}}
								/>
								<Text 
									style={{
										color: "#000000",
										fontSize: 16,
										marginBottom: 13,
										marginLeft: 15,
									}}>
									{mostBoughtStocks[0]?.name}
								</Text>
								<Text 
									style={{
										color: "#000000",
										fontSize: 15,
										marginBottom: 8,
										marginLeft: 15,
									}}>
									{`₹${mostBoughtStocks[0]?.price}`}
								</Text>
								<Text 
									style={{
										color: "#00B386",
										fontSize: 13,
										fontWeight: "bold",
										marginLeft: 15,
									}}>
									{mostBoughtStocks[0].change}
								</Text>
							</View>
							<View 
								style={{
									flex: 1,
									borderColor: "#E8E8E8",
									borderRadius: 10,
									borderWidth: 1,
									paddingVertical: 26,
								}}>
								<Image
									source = {require('../../../assets/tcs.png')} 
									resizeMode = {"stretch"}
									style={{
										borderRadius: 10,
										width: 50,
										height: 22,
										marginBottom: 13,
										marginLeft: 15,
									}}
								/>
								<Text 
									style={{
										color: "#000000",
										fontSize: 16,
										marginBottom: 13,
										marginLeft: 15,
									}}>
									{mostBoughtStocks[1]?.name}
								</Text>
								<Text 
									style={{
										color: "#000000",
										fontSize: 15,
										marginBottom: 8,
										marginLeft: 15,
									}}>
									{`₹${mostBoughtStocks[1]?.price}`}
								</Text>
								<Text 
									style={{
										color: "#F35D5D",
										fontSize: 13,
										fontWeight: "bold",
										marginLeft: 12,
									}}>
									{mostBoughtStocks[1].change}
								</Text>
							</View>
						</View>
						<View 
							style={{
								flexDirection: "row",
								alignItems: "center",
							}}>
							<View 
								style={{
									flex: 1,
									borderColor: "#E8E8E8",
									borderRadius: 10,
									borderWidth: 1,
									paddingTop: 14,
									marginRight: 20,
								}}>
								<Image
									source = {require('../../../assets/hdfc.png')} 
									resizeMode = {"stretch"}
									style={{
										borderRadius: 10,
										width: 38,
										height: 38,
										marginBottom: 8,
										marginLeft: 15,
									}}
								/>
								<Text 
									style={{
										color: "#000000",
										fontSize: 16,
										marginBottom: 13,
										marginLeft: 15,
									}}>
									{mostBoughtStocks[2]?.name}
								</Text>
								<Text 
									style={{
										color: "#000000",
										fontSize: 15,
										marginBottom: 8,
										marginLeft: 15,
									}}>
									{`₹${mostBoughtStocks[2]?.price}`}
								</Text>
								<Text 
									style={{
										color: "#00B386",
										fontSize: 13,
										fontWeight: "bold",
										marginBottom: 27,
										marginLeft: 18,
									}}>
									{mostBoughtStocks[2].change}
								</Text>
							</View>
							<View 
								style={{
									flex: 1,
									borderColor: "#E8E8E8",
									borderRadius: 10,
									borderWidth: 1,
									paddingTop: 14,
								}}>
								<Image
									source = {require('../../../assets/infosys.png')} 
									resizeMode = {"stretch"}
									style={{
										borderRadius: 10,
										width: 38,
										height: 38,
										marginBottom: 8,
										marginLeft: 15,
									}}
								/>
								<Text 
									style={{
										color: "#000000",
										fontSize: 16,
										marginBottom: 13,
										marginLeft: 15,
									}}>
									{mostBoughtStocks[3]?.name}
								</Text>
								<Text 
									style={{
										color: "#000000",
										fontSize: 15,
										marginBottom: 8,
										marginLeft: 15,
									}}>
									{`₹${mostBoughtStocks[3]?.price}`}
								</Text>
								<Text 
									style={{
										color: "#00B386",
										fontSize: 13,
										fontWeight: "bold",
										marginBottom: 27,
										marginLeft: 15,
									}}>
									{mostBoughtStocks[3].change}
								</Text>
							</View>
						</View>
					</View>
				</View>
				<View 
					style={{
						marginBottom: 22,
						marginHorizontal: 20,
					}}>
					<Text 
						style={{
							color: "#000000",
							fontSize: 18,
							marginBottom: 12,
							marginLeft: 1,
						}}>
						{"Product & Tools"}
					</Text>
					<View >
						<Image
							source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/cpui9l3b_expires_30_days.png"}} 
							resizeMode = {"stretch"}
							style={{
								height: 76,
								marginBottom: 8,
							}}
						/>
						<View 
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								marginLeft: 27,
								marginRight: 14,
							}}>
							<Text 
								style={{
									color: "#000000",
									fontSize: 12,
								}}>
								{"F&O"}
							</Text>
							<Text 
								style={{
									color: "#000000",
									fontSize: 12,
								}}>
								{"Events"}
							</Text>
							<Text 
								style={{
									color: "#000000",
									fontSize: 12,
								}}>
								{"IPO"}
							</Text>
							<Text 
								style={{
									color: "#000000",
									fontSize: 12,
								}}>
								{"All Stocks"}
							</Text>
						</View>
					</View>
				</View>
				<View 
					style={{
						backgroundColor: "#FFFFFF",
						paddingTop: 10,
						paddingHorizontal: 20,
						shadowColor: "#00000040",
						shadowOpacity: 0.3,
						shadowOffset: {
						    width: 0,
						    height: 0
						},
						shadowRadius: 5,
						elevation: 5,
					}}>
					<View 
						style={{
							backgroundColor: "#FFFFFF",
							paddingBottom: 22,
						}}>
						<View 
							style={{
								alignSelf: "flex-start",
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 8,
							}}>
							<Text 
								style={{
									color: "#000000",
									fontSize: 18,
									marginRight: 26,
								}}>
								{"Gainers"}
							</Text>
							<Text 
								style={{
									color: "#969696",
									fontSize: 18,
								}}>
								{"Losers"}
							</Text>
						</View>
						<View 
							style={{
								width: 62,
								height: 3,
								backgroundColor: "#00B386",
							}}>
						</View>
					</View>
					<Image
						source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/vz7mbi1y_expires_30_days.png"}} 
						resizeMode = {"stretch"}
						style={{
							position: "absolute",
							top: 8,
							left: 55,
							width: 28,
							height: 28,
						}}
					/>
					<View 
						style={{
							position: "absolute",
							top: 8,
							right: 0,
							left: 0,
							alignItems: "center",
						}}>
						<Image
							source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/sk1zqune_expires_30_days.png"}} 
							resizeMode = {"stretch"}
							style={{
								width: 28,
								height: 28,
							}}
						/>
					</View>
					<Image
						source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/bfzl0ya6_expires_30_days.png"}} 
						resizeMode = {"stretch"}
						style={{
							position: "absolute",
							top: 8,
							right: 55,
							width: 28,
							height: 28,
						}}
					/>
				</View>
			</ScrollView>
			)}
		</SafeAreaView>
		</BottomNavBar>
	);
}