import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import ActivityCard from "@/components/ActivityCard";
import BottomNav from "@/components/bottom-nav";
import { useFavoriteActivities, useFavorites } from "@/hooks/useFavorites";

export default function FavouritesScreen() {
  const router = useRouter();
  const { user, favoriteActivities, isLoading, isError, error, refetch } =
    useFavoriteActivities();

  const handleLoginPress = () => {
    router.push("/login");
  };

  const handleActivityPress = (activityId: string) => {
    router.push(`/ActivityDetails/${activityId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>Your saved activities appear below.</Text>
      </View>

      {!user ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>
            Please log in to view favorites.
          </Text>
          <Text style={styles.emptyDescription}>
            Favorites are saved per user and loaded from your account.
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLoginPress}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      ) : isLoading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#183B4E" />
          <Text style={styles.emptyDescription}>
            Loading favorite activities...
          </Text>
        </View>
      ) : isError ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Unable to load favorites.</Text>
          <Text style={styles.emptyDescription}>
            {error?.message ?? "Please try again."}
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => void refetch()}
          >
            <Text style={styles.loginButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : favoriteActivities.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No favorites yet.</Text>
          <Text style={styles.emptyDescription}>
            Add a favorite from an activity details page to see it here.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.cardsList}
          showsVerticalScrollIndicator={false}
        >
          {favoriteActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              id={activity.id}
              title={activity.title}
              location={activity.location}
              rating={activity.rating}
              imageUrl={activity.imageUrl}
              onPress={() => handleActivityPress(activity.id)}
            />
          ))}
        </ScrollView>
      )}

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#D8E1E6",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#183B4E",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#586B7A",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#183B4E",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 14,
    color: "#6C7A89",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 18,
  },
  loginButton: {
    backgroundColor: "#1E3A46",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  cardsList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
});
