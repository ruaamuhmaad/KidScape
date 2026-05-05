import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { logout } from "@/services/authService";

export default function ProfileActions() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.replace("/login" as any);
    } catch {
      Alert.alert("Logout failed", "Unable to log out right now.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.logoutBtn, isLoggingOut && styles.logoutBtnDisabled]}
        onPress={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
            <Text style={styles.logoutText}>Log out</Text>
          </>
        )}
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
  logoutBtnDisabled: {
    opacity: 0.7,
  },
});
