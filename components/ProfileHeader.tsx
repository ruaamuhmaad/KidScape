import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ProfileHeaderProps = {
  name?: string;
  imageUrl?: string;
  onImagePress?: () => void;
  isImageLoading?: boolean;
};

export default function ProfileHeader({
  name = "Parent Name",
  imageUrl,
  onImagePress,
  isImageLoading = false,
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

      <TouchableOpacity
        style={[styles.avatar, !imageUrl && styles.emptyAvatar]}
        onPress={onImagePress}
        disabled={!onImagePress || isImageLoading}
        activeOpacity={0.8}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.avatarImage} />
        ) : null}

        {isImageLoading ? (
          <View style={styles.avatarOverlay}>
            <ActivityIndicator color="#FFFFFF" />
          </View>
        ) : null}

        {onImagePress && !isImageLoading ? (
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={18} color="#FFFFFF" />
          </View>
        ) : (
          null
        )}
      </TouchableOpacity>

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

  emptyAvatar: {
    borderWidth: 1,
    borderColor: "#B8CAD1",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(30, 58, 70, 0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  cameraBadge: {
    position: "absolute",
    right: 6,
    bottom: 6,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#1E3A46",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  name: {
    fontSize: 16,
    color: "#2C3E50",
  },
});
