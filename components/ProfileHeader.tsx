import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileHeader() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1E3A46" />
        </TouchableOpacity>

        <Text style={styles.title}>Profile</Text>

        {/* spacer عشان يظل العنوان بالنص */}
        <View style={styles.spacer} />
      </View>

      {/* Avatar */}
      <View style={styles.avatar}>
        <Ionicons name="person" size={60} color="#1E3A46" />
      </View>

      <Text style={styles.name}>Parent Name</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
    width: "100%",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1E3A46",
  },

  spacer: {
    width: 20, // نفس حجم السهم تقريباً للمحافظة على التوسيط
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E6F0F3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  name: {
    fontSize: 16,
    color: "#2C3E50",
  },
});