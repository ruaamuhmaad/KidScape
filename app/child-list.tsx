import BottomNav from "@/components/bottom-nav";
import ChildCard from "@/components/ChildCard";
import { getChildrenByParentId, type ChildRecord } from "@/firebase";
import { getCurrentUserProfile } from "@/services/authService";
import {
  getErrorMessage,
  redirectToLoginIfNeeded,
} from "@/utils/errorHandling";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CHILDREN_PERMISSION = "children:manage";

export default function ChildListScreen() {
  const [children, setChildren] = useState<ChildRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadChildren = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      setErrorMessage("");

      const profile = await getCurrentUserProfile();
      if (!profile.permissions.includes(CHILDREN_PERMISSION)) {
        throw new Error("You do not have permission to manage children.");
      }

      setChildren(await getChildrenByParentId(profile.uid));
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Unable to load children right now."
      );
      setChildren([]);
      setErrorMessage(message);
      redirectToLoginIfNeeded(message);
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

  const statusMessage =
    errorMessage || (!children.length && !isLoading ? "No children added yet." : "");

  return (
    <View style={styles.container}>
      <ScreenHeader />

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {isLoading ? <LoadingState /> : null}
        {!isLoading && statusMessage ? <StatusText message={statusMessage} /> : null}
        {!isLoading && !statusMessage
          ? children.map((child) => <ChildCard key={child.id} child={child} />)
          : null}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add-child")}
        >
          <Ionicons name="add" size={20} color="#1E3A46" />
          <Text style={styles.addText}>Add new child</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const ScreenHeader = () => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={22} color="#1E3A46" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Child Management</Text>
    <View style={styles.headerSpacer} />
  </View>
);

const LoadingState = () => (
  <View style={styles.statusContainer}>
    <ActivityIndicator color="#1E3A46" />
  </View>
);

const StatusText = ({ message }: { message: string }) => (
  <Text style={styles.statusText}>{message}</Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    paddingTop: 50,
  },

  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  headerTitle: {
    color: "#1E3A46",
    fontSize: 18,
    fontWeight: "600",
  },

  headerSpacer: {
    width: 22,
  },

  listContent: {
    paddingBottom: 90,
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
    alignItems: "center",
    backgroundColor: "#AFC1CC",
    borderRadius: 25,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    marginHorizontal: 60,
    marginTop: 20,
    paddingVertical: 12,
  },

  addText: {
    color: "#1E3A46",
    fontSize: 12,
  },
});
