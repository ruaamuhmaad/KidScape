import BottomNav from "@/components/bottom-nav";
import ProfileActions from "@/components/ProfileActions";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileMenu from "@/components/ProfileMenu";
import { useCurrentProfile } from "@/hooks/useProfileQueries";
import {
  getErrorMessage,
  redirectToLoginIfNeeded,
} from "@/utils/errorHandling";
import { useEffect } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Profile() {
  const profileQuery = useCurrentProfile();
  const profile = profileQuery.data;
  const errorMessage = profileQuery.error
    ? getErrorMessage(
        profileQuery.error,
        "Unable to load your profile right now."
      )
    : "";

  useEffect(() => {
    if (errorMessage) {
      redirectToLoginIfNeeded(errorMessage);
    }
  }, [errorMessage]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ProfileHeader name={profile?.PName} imageUrl={profile?.imageUrl} />

        {profileQuery.isLoading ? (
          <View style={styles.statusContainer}>
            <ActivityIndicator color="#1E3A46" />
          </View>
        ) : null}

        {!profileQuery.isLoading && errorMessage ? (
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
