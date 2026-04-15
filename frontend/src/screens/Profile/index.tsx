import React, { useContext, useEffect, useState } from "react";
import { fetchPortfolio, addMoney } from "../../services/api";
import { View, ScrollView, Image, Text, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../context/AuthContext";

interface ProfileScreenProps {
  onNavigateToHome?: () => void;
  onNavigateToOrders?: () => void;
}

interface User {
  name?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
}

export default function ProfileScreen({
  onNavigateToHome,
  onNavigateToOrders,
}: ProfileScreenProps): React.ReactElement {
  const { user, logout } = useContext(AuthContext) as AuthContextType;
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";
  const [balance, setBalance] = useState("₹0.00");
  const [addMoneyVisible, setAddMoneyVisible] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [addingMoney, setAddingMoney] = useState(false);

  useEffect(() => {
    fetchPortfolio()
      .then((res) => {
        if (res.balance !== undefined) {
          setBalance(`₹${parseFloat(res.balance).toFixed(2)}`);
        }
      })
      .catch(console.error);
  }, []);

  const handleAddMoney = async () => {
    const amt = parseFloat(amountToAdd);
    if (isNaN(amt) || amt <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid amount.");
      return;
    }
    setAddingMoney(true);
    try {
      const res = await addMoney(amt);
      if (res.success) {
        setBalance(`$${parseFloat(res.balance).toFixed(2)}`);
        setAddMoneyVisible(false);
        setAmountToAdd("");
        Alert.alert("Success", "Funds added successfully!");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not add money at this time.");
    } finally {
      setAddingMoney(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 30,
        }}
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 30,
            marginHorizontal: 21,
            marginTop: 20,
          }}
        >
          <TouchableOpacity onPress={onNavigateToHome}>
            <Image
              source={{
                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/6vl7o6m6_expires_30_days.png",
              }}
              resizeMode={"stretch"}
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
            }}
          >
            <Image
              source={{
                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/f8rbj579_expires_30_days.png",
              }}
              resizeMode={"stretch"}
              style={{
                width: 26,
                height: 26,
                marginRight: 25,
              }}
            />
            <Image
              source={{
                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/n69612ru_expires_30_days.png",
              }}
              resizeMode={"stretch"}
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
          }}
        >
          <View
            style={{
              alignItems: "center",
              marginBottom: 20,
              marginHorizontal: 22,
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "#059669",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 30,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 48,
                  fontWeight: "bold",
                }}
              >
                {userInitial}
              </Text>
            </View>
            <Text
              style={{
                color: "#000000",
                fontSize: 27,
                textAlign: "center",
              }}
            >
              {user?.name || "User"}
            </Text>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: "#E8E8E8",
            }}
          ></View>
        </View>
        <View
          style={{
            marginBottom: 40,
            marginLeft: 20,
          }}
        >
          <View
            style={{
              marginBottom: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
                marginRight: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{
                    uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/1sr6mp42_expires_30_days.png",
                  }}
                  resizeMode={"stretch"}
                  style={{
                    width: 30,
                    height: 30,
                    marginRight: 20,
                  }}
                />
                <View>
                  <Text
                    style={{
                      color: "#000000",
                      fontSize: 16,
                      marginBottom: 8,
                      marginRight: 88,
                    }}
                  >
                    {balance}
                  </Text>
                  <Text
                    style={{
                      color: "#757575",
                      fontSize: 14,
                    }}
                  >
                    {"Available to invest"}
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
                }}
                onPress={() => setAddMoneyVisible(true)}
              >
                <Image
                  source={{
                    uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/j1wzdrii_expires_30_days.png",
                  }}
                  resizeMode={"stretch"}
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
                  }}
                >
                  {"Add money"}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignItems: "flex-end",
              }}
            >
              <View
                style={{
                  width: 342,
                  height: 1,
                  backgroundColor: "#E8E8E8",
                }}
              ></View>
            </View>
          </View>
          <View
            style={{
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              onPress={onNavigateToOrders}
              style={{
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 25,
              }}
            >
              <Image
                source={{
                  uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/ij3tm405_expires_30_days.png",
                }}
                resizeMode={"stretch"}
                style={{
                  width: 30,
                  height: 30,
                  marginRight: 20,
                }}
              />
              <View
                style={{
                  paddingBottom: 1,
                }}
              >
                <Text
                  style={{
                    color: "#000000",
                    fontSize: 18,
                  }}
                >
                  {"Orders"}
                </Text>
              </View>
            </TouchableOpacity>
            <View
              style={{
                alignItems: "flex-end",
              }}
            >
              <View
                style={{
                  width: 342,
                  height: 1,
                  backgroundColor: "#E8E8E8",
                }}
              ></View>
            </View>
          </View>
        </View>

        <View
          style={{
            alignItems: "center",
            marginBottom: 16,
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: "#F35D5D",
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 30,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {"Log Out"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={addMoneyVisible} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', width: '80%', padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Add Funds</Text>
            <TextInput 
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 15 }}
              keyboardType="numeric"
              placeholder="Enter amount (e.g. 1000)"
              value={amountToAdd}
              onChangeText={setAmountToAdd}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => setAddMoneyVisible(false)} style={{ padding: 10, marginRight: 10 }}>
                <Text style={{ color: '#757575', fontWeight: 'bold' }}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddMoney} style={{ padding: 10, backgroundColor: '#059669', borderRadius: 8 }}>
                {addingMoney ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: 'bold' }}>ADD</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
