import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BottomNav() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isHomeActive = pathname === "/" || pathname === "/home";
  const isFavouritesActive = pathname === "/favourites";
  const isNotificationsActive = pathname === "/notifications";
  const isProfileActive =
    pathname === "/profile" ||
    pathname === "/Edit-parent-profile" ||
    pathname === "/edit-parent-profile";

  return (
    <View style={[styles.navbar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/home")}
      >
        <Ionicons
          name="home-outline"
          size={22}
          color={isHomeActive ? "#235671" : "#6C7A89"}
        />
        <Text style={[styles.navText, isHomeActive && styles.navTextActive]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/favourites")}
      >
        <Ionicons
          name="heart-outline"
          size={22}
          color={isFavouritesActive ? "#235671" : "#6C7A89"}
        />
        <Text style={[styles.navText, isFavouritesActive && styles.navTextActive]}>
          Favourites
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/notifications")}
      >
        <Ionicons
          name="notifications-outline"
          size={22}
          color={isNotificationsActive ? "#235671" : "#6C7A89"}
        />
        <Text style={[styles.navText, isNotificationsActive && styles.navTextActive]}>
          Notifications
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/profile")}
      >
        <Ionicons
          name="person-outline"
          size={22}
          color={isProfileActive ? "#235671" : "#6C7A89"}
        />
        <Text style={[styles.navText, isProfileActive && styles.navTextActive]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#AFC1CC",
    paddingTop: 15,
    paddingHorizontal: 12,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  navText: {
    fontSize: 10,
    color: "#6C7A89",
    marginTop: 3,
  },
  navTextActive: {
    color: "#235671",
    fontWeight: "700",
  },
});
