import BottomNav from "@/components/bottom-nav";
import ChildCard from "@/components/ChildCard";
import { useCurrentParentChildren } from "@/hooks/useChildrenQueries";
import {
  getErrorMessage,
  redirectToLoginIfNeeded,
} from "@/utils/errorHandling";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChildListScreen() {
  const {
    children,
    isLoading,
    isRefreshing,
    error,
    refetchChildren,
  } = useCurrentParentChildren();

  const errorMessage = error
    ? getErrorMessage(error, "Unable to load children right now.")
    : "";

  useEffect(() => {
    if (errorMessage) {
      redirectToLoginIfNeeded(errorMessage);
    }
  }, [errorMessage]);

  useFocusEffect(
    useCallback(() => {
      void refetchChildren();
    }, [refetchChildren])
  );

  const handleRefresh = () => {
    void refetchChildren();
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
          ? children.map((child) => (
              <TouchableOpacity
                key={child.id}
                onPress={() => router.push(`/edit-child?id=${child.id}`)}
              >
                <ChildCard child={child} />
              </TouchableOpacity>
            ))
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
