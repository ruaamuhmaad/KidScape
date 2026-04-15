import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ProfileHeaderProps = {
  name?: string;
  imageUrl?: string;
};

export default function ProfileHeader({
  name = "Parent Name",
  imageUrl,
}: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1E3A46" />
        </TouchableOpacity>

        <Text style={styles.title}>Profile</Text>

        <View style={styles.spacer} />
      </View>

      <View style={styles.avatar}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.avatarImage} />
        ) : (
          <Ionicons name="person" size={60} color="#1E3A46" />
        )}
      </View>

      <Text style={styles.name}>{name}</Text>
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
    width: 20,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E6F0F3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  name: {
    fontSize: 16,
    color: "#2C3E50",
  },
});
