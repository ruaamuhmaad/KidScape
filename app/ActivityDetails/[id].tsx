import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ReviewsTab from "@/components/activity-details/ReviewsTab";
import OverviewTab from "@/components/activity-details/OverviewTab";
import DetailsTab from "@/components/activity-details/DetailsTab";
import CostsTab from "@/components/activity-details/CostsTab";
import ActivityTabs from "@/components/activity-details/ActivityTabs";
import { getActivityById } from "@/firebase/activityDetailsService";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import styles from "@/style/activityDetailsStyles";
import { COLORS } from "@/constants/colors";
import type {
  ActivityDetailsRecord,
  ActivityTabName,
} from "@/components/activity-details/types";

export default function ActivityDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ActivityTabName>("Overview");
  const [activity, setActivity] = useState<ActivityDetailsRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const activityId = Array.isArray(id) ? id[0] : id;

  const fetchActivity = useCallback(async () => {
    try {
      if (!activityId || typeof activityId !== "string") {
        setActivity(null);
        return;
      }

      const data = await getActivityById(activityId);
      setActivity(data);
    } catch (error) {
      console.log("Fetch activity error:", error);
      setActivity(null);
    } finally {
      setLoading(false);
    }
  }, [activityId]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  useFocusEffect(
    useCallback(() => {
      void fetchActivity();
    }, [fetchActivity])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.blue} />
        </View>
      </SafeAreaView>
    );
  }

  if (!activity) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Activity not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case "Overview":
        return <OverviewTab activity={activity} />;
      case "Details":
        return <DetailsTab activity={activity} />;
      case "Costs":
        return <CostsTab activity={activity} />;
      case "Reviews":
        return <ReviewsTab activity={activity} />;
      default:
        return <OverviewTab activity={activity} />;
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Activity Details</Text>

        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: activity.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.activityTitle}>{activity.title}</Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={15} color={COLORS.blue} />
            <Text style={styles.locationText}>{activity.location}</Text>
          </View>
        </View>

        <ActivityTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {renderTab()}
      </ScrollView>

      {activeTab !== "Reviews" && (
        <View style={styles.footer}>
          <PrimaryButton
            title="Registration Request"
            onPress={() =>
              router.push({
                pathname: "/booking-form",
                params: {
                  activity: activity.title,
                  activityId: activity.id,
                },
              })
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}
