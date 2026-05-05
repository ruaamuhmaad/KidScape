import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { getChildrenByParentId, type ChildRecord } from "@/firebase";
import { getCurrentUserProfile } from "@/services/authService";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChildListScreen() {
  const [children, setChildren] = useState<ChildRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadChildren = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) {
        setIsLoading(true);
      }

      setErrorMessage("");

      const profile = await getCurrentUserProfile();

      if (!profile.permissions.includes("children:manage")) {
        throw new Error("You do not have permission to manage children.");
      }

      const childRecords = await getChildrenByParentId(profile.uid);
      setChildren(childRecords);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load children right now.";

      setErrorMessage(message);
      setChildren([]);

      if (message.toLowerCase().includes("log in")) {
        router.replace("/login" as any);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadChildren(true);
    }, [loadChildren])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    void loadChildren();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1E3A46" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Child Management</Text>

        {/* spacer للمحافظة على توسيط العنوان */}
        <View style={{ width: 22 }} />
      </View>

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {isLoading ? (
          <View style={styles.statusContainer}>
            <ActivityIndicator color="#1E3A46" />
          </View>
        ) : null}

        {!isLoading && errorMessage ? (
          <Text style={styles.statusText}>{errorMessage}</Text>
        ) : null}

        {!isLoading && !errorMessage && children.length === 0 ? (
          <Text style={styles.statusText}>No children added yet.</Text>
        ) : null}

        {!isLoading && !errorMessage ? children.map((child) => (
          <View key={child.id} style={styles.card}>
            {child.imageUrl ? (
              <Image source={{ uri: child.imageUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>
                  {child.name.charAt(0).toUpperCase() || "?"}
                </Text>
              </View>
            )}

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{child.name}</Text>
              <Text style={styles.details}>
                {[child.gender, `${child.age} years`, child.city]
                  .filter(Boolean)
                  .join(" - ")}
              </Text>
              {child.dateOfBirth ? (
                <Text style={styles.interests}>
                  Date of birth: {child.dateOfBirth}
                </Text>
              ) : null}
              {child.interests?.length ? (
                <Text style={styles.interests} numberOfLines={1}>
                  {child.interests.join(", ")}
                </Text>
              ) : null}
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#1E3A46"
            />
          </View>
        )) : null}

        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add-child")}
        >
          <Ionicons name="add" size={20} color="#1E3A46" />
          <Text style={styles.addText}>Add new child</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E3A46",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCE3E7",
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    padding: 12,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27,
    marginRight: 12,
  },

  avatarFallback: {
    width: 55,
    height: 55,
    borderRadius: 27,
    marginRight: 12,
    backgroundColor: "#E6F0F3",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarInitial: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A46",
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E3A46",
  },

  details: {
    color: "#48606B",
    fontSize: 12,
    marginTop: 3,
  },

  interests: {
    color: "#6C7A89",
    fontSize: 11,
    marginTop: 3,
  },

  dash: {
    fontSize: 10,
    color: "#6C7A89",
  },

  statusContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },

  statusText: {
    color: "#6C7A89",
    fontSize: 13,
    paddingHorizontal: 20,
    paddingVertical: 30,
    textAlign: "center",
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#AFC1CC",
    marginHorizontal: 60,
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 5,
  },

  addText: {
    fontSize: 12,
    color: "#1E3A46",
  },

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
