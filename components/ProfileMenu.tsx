import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MenuItem = ({ icon, title, onPress }: any) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View style={styles.left}>
      <Ionicons name={icon} size={20} color="#1E3A46" />
      <Text style={styles.text}>{title}</Text>
    </View>

    <Ionicons name="chevron-forward" size={20} color="#1E3A46" />
  </TouchableOpacity>
);


export default function ProfileMenu() {
  return (
    <View style={styles.container}>
      <MenuItem
        icon="settings-outline"
        title="Edit profile"
        onPress={() => router.push("/Edit-parent-profile")}
      />

      <MenuItem
        icon="notifications-outline"
        title="Notifications"
      />

      <MenuItem
        icon="person-outline"
        title="Child Management"
        onPress={() => router.push("/child-list")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#DDE3E7",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 30,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#C9D1D6",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontSize: 15,
    color: "#1E3A46",
  },
});