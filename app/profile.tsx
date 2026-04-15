import { getUser, type UserProfile } from "@/api/editUserService";
import BottomNav from "@/components/bottom-nav";
import ProfileActions from "@/components/ProfileActions";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileMenu from "@/components/ProfileMenu";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Profile() {
  const userId = 1;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const userProfile = await getUser(userId);

        if (!isMounted) {
          return;
        }

        setProfile(userProfile);
        setErrorMessage("");
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage(`Unable to load user ${userId} right now.`);
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
  }, [userId]);

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
