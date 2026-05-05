import BottomNav from "@/components/bottom-nav";
import ProfileActions from "@/components/ProfileActions";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileMenu from "@/components/ProfileMenu";
import {
  getCurrentUserProfile,
  type AuthenticatedUserProfile,
} from "@/services/authService";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Profile() {
  const [profile, setProfile] = useState<AuthenticatedUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const userProfile = await getCurrentUserProfile();

        if (!isMounted) {
          return;
        }

        setProfile(userProfile);
        setErrorMessage("");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load your profile right now.";

        setErrorMessage(message);

        if (message.toLowerCase().includes("log in")) {
          router.replace("/login" as any);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ProfileHeader name={profile?.PName} imageUrl={profile?.imageUrl} />

        {isLoading ? (
          <View style={styles.statusContainer}>
            <ActivityIndicator color="#1E3A46" />
          </View>
        ) : null}

        {!isLoading && errorMessage ? (
          <Text style={styles.statusText}>{errorMessage}</Text>
        ) : null}

        <ProfileMenu />

        <View style={styles.actionsWrapper}>
          <ProfileActions />
        </View>
      </View>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionsWrapper: {
    marginTop: "auto",
  },
  statusContainer: {
    alignItems: "center",
    marginTop: -10,
    marginBottom: 20,
  },
  statusText: {
    textAlign: "center",
    color: "#6C7A89",
    marginTop: -10,
    marginBottom: 20,
  },
});
