import React, { useState, useContext } from "react";
import { View, ScrollView, Image, Text, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthContext } from "../../context/AuthContext";

interface StocksScreenProps {
  onNavigateToProfile?: () => void;
}

interface User {
  name?: string;
}

interface AuthContextType {
  user: User | null;
}

export default function StocksScreen({ onNavigateToProfile }: StocksScreenProps): React.ReactElement {
	const [textInput1, onChangeTextInput1] = useState<string>('');
	const { user } = useContext(AuthContext) as AuthContextType;
	const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';
	return (
		<SafeAreaProvider 
			style={{
				flex: 1,
				backgroundColor: "#FFFFFF",
			}}>
			<ScrollView  
				style={{
					flex: 1,
					backgroundColor: "#FFFFFF",
					borderRadius: 30,
					paddingTop: 50,
				}}>
				<View 
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginBottom: 37,
						marginHorizontal: 30,
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
								{"24,194.50"}
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
								{"52,191.50"}
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
									source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/9mr0fv8v_expires_30_days.png"}} 
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
									{"Triveni Turbine"}
								</Text>
								<Text 
									style={{
										color: "#000000",
										fontSize: 15,
										marginBottom: 8,
										marginLeft: 15,
									}}>
									{"₹823.96"}
								</Text>
								<Text 
									style={{
										color: "#00B386",
										fontSize: 13,
										fontWeight: "bold",
										marginLeft: 15,
									}}>
									{"+59.80 (7.83%)"}
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
									source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/efz8yzn9_expires_30_days.png"}} 
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
									{"BSE"}
								</Text>
								<Text 
									style={{
										color: "#000000",
										fontSize: 15,
										marginBottom: 8,
										marginLeft: 15,
									}}>
									{"₹4,431.10"}
								</Text>
								<Text 
									style={{
										color: "#F35D5D",
										fontSize: 13,
										fontWeight: "bold",
										marginLeft: 12,
									}}>
									{"-255.70 (5.46%)"}
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
									source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/4x59bi07_expires_30_days.png"}} 
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
									{"Zomato"}
								</Text>
								<Text 
									style={{
										color: "#000000",
										fontSize: 15,
										marginBottom: 8,
										marginLeft: 15,
									}}>
									{"₹280.11"}
								</Text>
								<Text 
									style={{
										color: "#00B386",
										fontSize: 13,
										fontWeight: "bold",
										marginBottom: 27,
										marginLeft: 18,
									}}>
									{"+6.80 (2.49%)"}
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
									source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/dvkroero_expires_30_days.png"}} 
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
									{"Swiggy"}
								</Text>
								<Text 
									style={{
										color: "#000000",
										fontSize: 15,
										marginBottom: 8,
										marginLeft: 15,
									}}>
									{"₹461.90"}
								</Text>
								<Text 
									style={{
										color: "#00B386",
										fontSize: 13,
										fontWeight: "bold",
										marginBottom: 27,
										marginLeft: 15,
									}}>
									{"+31.20 (7.24%)"}
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
		</SafeAreaProvider>
	);
}