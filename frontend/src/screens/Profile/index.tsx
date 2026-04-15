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
  const [paymentStep, setPaymentStep] = useState<"input" | "processing" | "gateway" | "success">("input");

  useEffect(() => {
    fetchPortfolio()
      .then((res) => {
        if (res.balance !== undefined) {
          setBalance(`₹${parseFloat(res.balance).toFixed(2)}`);
        }
      })
      .catch(console.error);
  }, []);

  const startPaymentFlow = () => {
    const amt = parseFloat(amountToAdd);
    if (isNaN(amt) || amt <= 10) {
      Alert.alert("Invalid Amount", "Please enter at least ₹10.");
      return;
    }
    setPaymentStep("processing");
    setTimeout(() => {
      setPaymentStep("gateway");
    }, 2000);
  };

  const confirmPayment = async () => {
    setAddingMoney(true);
    try {
      const amt = parseFloat(amountToAdd);
      const res = await addMoney(amt);
      if (res.success) {
        setBalance(`₹${parseFloat(res.balance).toFixed(2)}`);
        setPaymentStep("success");
        setTimeout(() => {
          setAddMoneyVisible(false);
          setPaymentStep("input");
          setAmountToAdd("");
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Payment Failed", "Something went wrong. Please try again.");
      setPaymentStep("input");
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
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', width: '90%', padding: 24, borderRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 10 }}>
            
            {paymentStep === "input" && (
              <>
                <Text style={{ fontSize: 20, fontWeight: '800', marginBottom: 8, color: '#000' }}>Add Funds</Text>
                <Text style={{ fontSize: 13, color: '#666', marginBottom: 20, fontWeight: '600' }}>Enter amount to add to your Groww Balance</Text>
                <View style={{ backgroundColor: '#F9F9F9', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#EEE', marginBottom: 24 }}>
                  <Text style={{ fontSize: 11, color: '#999', fontWeight: '800', marginBottom: 4 }}>AMOUNT (₹)</Text>
                  <TextInput 
                    style={{ fontSize: 24, fontWeight: '800', color: '#000', padding: 0 }}
                    keyboardType="numeric"
                    placeholder="0"
                    value={amountToAdd}
                    onChangeText={setAmountToAdd}
                    autoFocus
                  />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
                  <TouchableOpacity onPress={() => setAddMoneyVisible(false)} style={{ paddingVertical: 12, paddingHorizontal: 20 }}>
                    <Text style={{ color: '#666', fontWeight: '700' }}>CANCEL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={startPaymentFlow} 
                    style={{ backgroundColor: '#059669', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24, shadowColor: "#059669", shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 5 }}
                  >
                    <Text style={{ color: '#fff', fontWeight: '800' }}>PROCEED</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {paymentStep === "processing" && (
              <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                <ActivityIndicator size="large" color="#059669" />
                <Text style={{ marginTop: 24, fontSize: 16, fontWeight: '700', color: '#333' }}>Connecting to Secure Gateway</Text>
                <Text style={{ marginTop: 8, fontSize: 13, color: '#999', fontWeight: '600' }}>Please do not refresh or close this tab</Text>
              </View>
            )}

            {paymentStep === "gateway" && (
              <View style={{ alignItems: 'center' }}>
                <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#E9FAF2', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                  <Image 
                    source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/w8lS8rAT8w/1sr6mp42_expires_30_days.png" }}
                    style={{ width: 30, height: 30 }}
                  />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#000', marginBottom: 4 }}>Secure Payment</Text>
                <Text style={{ fontSize: 24, fontWeight: '900', color: '#059669', marginBottom: 24 }}>₹{parseFloat(amountToAdd).toLocaleString('en-IN')}</Text>
                
                <View style={{ width: '100%', backgroundColor: '#F9F9F9', borderRadius: 12, padding: 20, marginBottom: 24 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                    <Text style={{ color: '#666', fontWeight: '600' }}>Payment Method</Text>
                    <Text style={{ color: '#000', fontWeight: '700' }}>Groww UPI</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#666', fontWeight: '600' }}>Transaction Fee</Text>
                    <Text style={{ color: '#000', fontWeight: '700' }}>₹0.00</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  onPress={confirmPayment} 
                  disabled={addingMoney}
                  style={{ width: '100%', backgroundColor: '#000', borderRadius: 14, paddingVertical: 16, alignItems: 'center', shadowColor: "#000", shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 5 }}
                >
                  {addingMoney ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>PAY NOW</Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPaymentStep("input")} style={{ marginTop: 16 }}>
                  <Text style={{ color: '#666', fontWeight: '700' }}>Back</Text>
                </TouchableOpacity>
              </View>
            )}

            {paymentStep === "success" && (
              <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#E9FAF2', justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
                  <Text style={{ fontSize: 40 }}>✅</Text>
                </View>
                <Text style={{ fontSize: 22, fontWeight: '800', color: '#000', marginBottom: 8 }}>Success!</Text>
                <Text style={{ fontSize: 15, color: '#666', textAlign: 'center', fontWeight: '600' }}>₹{parseFloat(amountToAdd).toLocaleString('en-IN')} added to your wallet</Text>
              </View>
            )}

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
