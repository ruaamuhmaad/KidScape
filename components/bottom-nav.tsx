import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BottomNav() {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/home")}
      >
        <Ionicons name="home-outline" size={22} color="#1E3A46" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/")}
      >
        <Ionicons name="heart-outline" size={22} color="#1E3A46" />
        <Text style={styles.navText}>Favourites</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/notifications")}
      >
        <Ionicons
          name="notifications-outline"
          size={22}
          color="#1E3A46"
        />
        <Text style={styles.navText}>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/profile")}
      >
        <Ionicons name="person-outline" size={22} color="#1E3A46" />
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#AFC1CC",
    paddingVertical: 15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  navText: {
    fontSize: 10,
    color: "#1E3A46",
    marginTop: 3,
  },
});