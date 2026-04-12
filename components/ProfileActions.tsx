import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileActions() {
  return (
    <View>
      <TouchableOpacity style={styles.logoutBtn}>
        <Ionicons name="log-out-outline" size={18} color="#fff" />
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn}>
        <Text style={styles.deleteText}>Delete account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  logoutBtn: {
    backgroundColor: "#1E3A46",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 15,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
  },
  deleteBtn: {
    backgroundColor: "#AAB7C2",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontSize: 15,
  },
});