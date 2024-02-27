import { StyleSheet, Text, View } from "react-native";
import * as Superwall from "expo-superwall";
import { useEffect } from "react";

const SUPERWALL_API_KEY = process.env.EXPO_PUBLIC_SUPERWALL_API_KEY;
const REVENUECAT_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;

if (!SUPERWALL_API_KEY || !REVENUECAT_API_KEY) {
  throw new Error("Please setup required environment variables");
}

Superwall.configure(SUPERWALL_API_KEY);
Superwall.syncSubscriptionStatus(REVENUECAT_API_KEY);

export default function App() {
  useEffect(() => {
    // Make a campaign in Superwall that when the "View Home Screen" event gets triggered, it shows a paywall
    Superwall.register("View Home Screen");
  }, []);

  return (
    <View style={styles.container}>
      <Text>Hello World</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
