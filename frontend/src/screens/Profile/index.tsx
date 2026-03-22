import React, { useContext } from "react";
import { View, ScrollView, Image, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../context/AuthContext";

interface ProfileScreenProps {
  onNavigateToHome?: () => void;
}

interface User {
  name?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
}

export default function ProfileScreen({ onNavigateToHome }: ProfileScreenProps): React.ReactElement {
	const { user, logout } = useContext(AuthContext) as AuthContextType;
	const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';

	const handleLogout = async () => {
		await logout();
	};

	return (
		<SafeAreaView 
			style={{
				flex: 1,
				backgroundColor: "#FFFFFF",
			}}>
			<ScrollView  
				contentContainerStyle={{
					paddingBottom: 30,
				}}
				style={{
					flex: 1,
					backgroundColor: "#FFFFFF",
				}}>
				<View 
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 30,
						marginHorizontal: 21,
						marginTop: 20,
					}}>
					<TouchableOpacity onPress={onNavigateToHome}>
						<Image
							source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/6vl7o6m6_expires_30_days.png"}} 
							resizeMode = {"stretch"}
							style={{
								width: 32,
								height: 18,
							}}
						/>
					</TouchableOpacity>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
						}}>
						<Image
							source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/f8rbj579_expires_30_days.png"}} 
							resizeMode = {"stretch"}
							style={{
								width: 26,
								height: 26,
								marginRight: 25,
							}}
						/>
						<Image
							source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/n69612ru_expires_30_days.png"}} 
							resizeMode = {"stretch"}
							style={{
								width: 26,
								height: 26,
							}}
						/>
					</View>
				</View>
				<View 
					style={{
						marginBottom: 20,
					}}>
					<View 
						style={{
							alignItems: "center",
							marginBottom: 20,
							marginHorizontal: 22,
						}}>
						<View
							style={{
								width: 100,
								height: 100,
								borderRadius: 50,
								backgroundColor: "#059669",
								justifyContent: "center",
								alignItems: "center",
								marginBottom: 30,
							}}>
							<Text 
								style={{
									color: "#FFFFFF",
									fontSize: 48,
									fontWeight: "bold",
								}}>
								{userInitial}
							</Text>
						</View>
						<Text 
							style={{
								color: "#000000",
								fontSize: 27,
								textAlign: "center",
							}}>
							{user?.name || "User"}
						</Text>
					</View>
					<View 
						style={{
							height: 1,
							backgroundColor: "#E8E8E8",
						}}>
					</View>
				</View>
				<View 
					style={{
						marginBottom: 40,
						marginLeft: 20,
					}}>
					<View 
						style={{
							marginBottom: 20,
						}}>
						<View 
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: 20,
								marginRight: 20,
							}}>
							<View 
								style={{
									flexDirection: "row",
									alignItems: "center",
								}}>
								<Image
									source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/1sr6mp42_expires_30_days.png"}} 
									resizeMode = {"stretch"}
									style={{
										width: 30,
										height: 30,
										marginRight: 20,
									}}
								/>
								<View >
									<Text 
										style={{
											color: "#000000",
											fontSize: 16,
											marginBottom: 8,
											marginRight: 88,
										}}>
										{"$0.00"}
									</Text>
									<Text 
										style={{
											color: "#757575",
											fontSize: 14,
										}}>
										{"Stocks, F&O balance"}
									</Text>
								</View>
							</View>
							<TouchableOpacity 
								style={{
									flexDirection: "row",
									alignItems: "center",
									backgroundColor: "#E9FAF2",
									borderRadius: 8,
									paddingVertical: 9,
									paddingHorizontal: 11,
								}} onPress={()=>alert('Pressed!')}>
								<Image
									source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/j1wzdrii_expires_30_days.png"}} 
									resizeMode = {"stretch"}
									style={{
										borderRadius: 8,
										width: 20,
										height: 20,
										marginRight: 8,
									}}
								/>
								<Text 
									style={{
										color: "#32B495",
										fontSize: 13,
									}}>
									{"Add money"}
								</Text>
							</TouchableOpacity>
						</View>
						<View 
							style={{
								alignItems: "flex-end",
							}}>
							<View 
								style={{
									width: 342,
									height: 1,
									backgroundColor: "#E8E8E8",
								}}>
							</View>
						</View>
					</View>
					<View 
						style={{
							marginBottom: 20,
						}}>
						<View 
							style={{
								alignSelf: "flex-start",
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 25,
							}}>
							<Image
								source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/ij3tm405_expires_30_days.png"}} 
								resizeMode = {"stretch"}
								style={{
									width: 30,
									height: 30,
									marginRight: 20,
								}}
							/>
							<View 
								style={{
									paddingBottom: 1,
								}}>
								<Text 
									style={{
										color: "#000000",
										fontSize: 18,
									}}>
									{"Orders"}
								</Text>
							</View>
						</View>
						<View 
							style={{
								alignItems: "flex-end",
							}}>
							<View 
								style={{
									width: 342,
									height: 1,
									backgroundColor: "#E8E8E8",
								}}>
							</View>
						</View>
					</View>
					<View 
						style={{
							marginBottom: 20,
						}}>
						<View 
							style={{
								alignSelf: "flex-start",
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 25,
							}}>
							<Image
								source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/gdo5vl7k_expires_30_days.png"}} 
								resizeMode = {"stretch"}
								style={{
									width: 30,
									height: 30,
									marginRight: 20,
								}}
							/>
							<View 
								style={{
									paddingBottom: 1,
								}}>
								<Text 
									style={{
										color: "#000000",
										fontSize: 18,
									}}>
									{"Account Details"}
								</Text>
							</View>
						</View>
						<View 
							style={{
								alignItems: "flex-end",
							}}>
							<View 
								style={{
									width: 342,
									height: 1,
									backgroundColor: "#E8E8E8",
								}}>
							</View>
						</View>
					</View>
					<View 
						style={{
							marginBottom: 16,
						}}>
						<View 
							style={{
								alignSelf: "flex-start",
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 25,
							}}>
							<Image
								source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/rbul8zj1_expires_30_days.png"}} 
								resizeMode = {"stretch"}
								style={{
									width: 30,
									height: 30,
									marginRight: 20,
								}}
							/>
							<View 
								style={{
									paddingBottom: 1,
								}}>
								<Text 
									style={{
										color: "#000000",
										fontSize: 18,
									}}>
									{"Banks & Autopay"}
								</Text>
							</View>
						</View>
						<View 
							style={{
								alignItems: "flex-end",
							}}>
							<View 
								style={{
									width: 342,
									height: 1,
									backgroundColor: "#E8E8E8",
								}}>
							</View>
						</View>
					</View>
					<View 
						style={{
							marginBottom: 20,
						}}>
						<View 
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: 21,
								marginRight: 20,
							}}>
							<View 
								style={{
									flexDirection: "row",
									alignItems: "center",
								}}>
								<Image
									source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/8v0gbaxq_expires_30_days.png"}} 
									resizeMode = {"stretch"}
									style={{
										width: 30,
										height: 30,
										marginRight: 20,
									}}
								/>
								<View 
									style={{
										paddingBottom: 1,
									}}>
									<Text 
										style={{
											color: "#000000",
											fontSize: 18,
										}}>
										{"Refer"}
									</Text>
								</View>
							</View>
							<TouchableOpacity 
								style={{
									flexDirection: "row",
									alignItems: "center",
									backgroundColor: "#E9FAF2",
									borderRadius: 8,
									paddingVertical: 9,
									paddingHorizontal: 17,
								}} onPress={()=>alert('Pressed!')}>
								<Image
									source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/xryqsii0_expires_30_days.png"}} 
									resizeMode = {"stretch"}
									style={{
										borderRadius: 8,
										width: 20,
										height: 20,
										marginRight: 8,
									}}
								/>
								<Text 
									style={{
										color: "#32B495",
										fontSize: 13,
									}}>
									{"Invite"}
								</Text>
							</TouchableOpacity>
						</View>
						<View 
							style={{
								alignItems: "flex-end",
							}}>
							<View 
								style={{
									width: 342,
									height: 1,
									backgroundColor: "#E8E8E8",
								}}>
							</View>
						</View>
					</View>
					<View 
						style={{
							marginBottom: 20,
						}}>
						<View 
							style={{
								alignSelf: "flex-start",
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 25,
							}}>
							<Image
								source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/9xu96prq_expires_30_days.png"}} 
								resizeMode = {"stretch"}
								style={{
									width: 30,
									height: 30,
									marginRight: 20,
								}}
							/>
							<View 
								style={{
									paddingBottom: 1,
								}}>
								<Text 
									style={{
										color: "#000000",
										fontSize: 18,
									}}>
									{"Customer Support 24x7"}
								</Text>
							</View>
						</View>
						<View 
							style={{
								alignItems: "flex-end",
							}}>
							<View 
								style={{
									width: 342,
									height: 1,
									backgroundColor: "#E8E8E8",
								}}>
							</View>
						</View>
					</View>
					<View >
						<View 
							style={{
								alignSelf: "flex-start",
								flexDirection: "row",
								alignItems: "center",
								marginBottom: 25,
							}}>
							<Image
								source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/1ar2s464_expires_30_days.png"}} 
								resizeMode = {"stretch"}
								style={{
									width: 30,
									height: 30,
									marginRight: 20,
								}}
							/>
							<View 
								style={{
									paddingBottom: 1,
								}}>
								<Text 
									style={{
										color: "#000000",
										fontSize: 18,
									}}>
									{"Reports"}
								</Text>
							</View>
						</View>
						<View 
							style={{
								alignItems: "flex-end",
							}}>
							<View 
								style={{
									width: 342,
									height: 1,
									backgroundColor: "#E8E8E8",
								}}>
							</View>
						</View>
					</View>
				</View>
				<View 
					style={{
						alignItems: "center",
						marginBottom: 16,
					}}>
					<Image
						source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/ath1vydr_expires_30_days.png"}} 
						resizeMode = {"stretch"}
						style={{
							borderRadius: 30,
							width: 25,
							height: 25,
						}}
					/>
				</View>
				<View 
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 21,
						marginHorizontal: 43,
					}}>
					<View >
						<Text 
							style={{
								color: "#000000",
								fontSize: 13,
								marginBottom: 2,
							}}>
							{"About Us"}
						</Text>
						<View 
							style={{
								width: 54,
								height: 1,
							}}>
						</View>
					</View>
					<View 
						style={{
							paddingBottom: 1,
						}}>
						<Text 
							style={{
								color: "#757575",
								fontSize: 13,
							}}>
							{"Version 17.74"}
						</Text>
					</View>
					<View >
						<Text 
							style={{
								color: "#000000",
								fontSize: 13,
								marginBottom: 2,
							}}>
							{"Charges"}
						</Text>
						<View 
							style={{
								width: 49,
								height: 1,
							}}>
						</View>
					</View>
				</View>
				<View 
					style={{
						alignItems: "center",
						marginBottom: 16,
						marginTop: 20,
					}}>
					<TouchableOpacity 
						onPress={handleLogout}
						style={{
							backgroundColor: "#F35D5D",
							borderRadius: 8,
							paddingVertical: 12,
							paddingHorizontal: 30,
						}}>
						<Text 
							style={{
								color: "#FFFFFF",
								fontSize: 16,
								fontWeight: "bold",
							}}>
							{"Log Out"}
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}