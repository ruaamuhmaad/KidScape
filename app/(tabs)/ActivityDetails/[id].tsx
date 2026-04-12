import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ACTIVITIES } from "@/data/activities";
import OverviewTab from "@/components/activity-details/OverviewTab";
import DetailsTab from "@/components/activity-details/DetailsTab";
import CostsTab from "@/components/activity-details/CostsTab";
import ActivityTabs from "@/components/activity-details/ActivityTabs";

const BLUE = "#2C6E8A";
const DARK = "#1a1a1a";

export default function ActivityDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");

  const activityId = Array.isArray(id) ? id[0] : id;
  const activity = ACTIVITIES[activityId || "1"] || ACTIVITIES["1"];

  const renderTab = () => {
    switch (activeTab) {
      case "Overview":
        return <OverviewTab activity={activity} />;

      case "Details":
        return <DetailsTab activity={activity} />;

      case "Costs":
        return <CostsTab activity={activity} />;

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
            <Ionicons name="location-sharp" size={15} color={BLUE} />
            <Text style={styles.locationText}>{activity.location}</Text>
          </View>
        </View>

        <ActivityTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {renderTab()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/booking-form",
              params: { activity: activity.title },
            })
          }
          activeOpacity={0.85}
        >
          <Text style={styles.registerButtonText}>Registration Request</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e8e8e8",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: DARK,
    letterSpacing: 0.2,
  },

  iconBtn: { padding: 4, width: 30 },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },

  imageWrapper: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    overflow: "hidden",
  },

  heroImage: { width: "100%", height: 210 },

  titleBlock: { marginHorizontal: 16, marginTop: 14 },

  activityTitle: { fontSize: 20, fontWeight: "700", color: DARK },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  locationText: {
    fontSize: 13.5,
    color: "#555",
    marginLeft: 4,
  },

  footer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#e8e8e8",
  },

  registerButton: {
    backgroundColor: "#1B3C4F",
    borderRadius: 28,
    paddingVertical: 15,
    alignItems: "center",
  },

  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});