import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import OverviewTab from "@/components/activity-details/OverviewTab";
import DetailsTab from "@/components/activity-details/DetailsTab";
import CostsTab from "@/components/activity-details/CostsTab";
import ActivityTabs from "@/components/activity-details/ActivityTabs";
import type {
  ActivityCost,
  ActivityDetailsRecord,
  ActivityDetailsInfo,
  ActivityOverviewItem,
  ActivityReview,
  ActivityTabName,
} from "@/components/activity-details/types";
import { getActivityById } from "@/firebase";

const BLUE = "#2C6E8A";
const DARK = "#1a1a1a";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80";
const OVERVIEW_ICON_NAMES: ActivityOverviewItem["icon"][] = [
  "shield-checkmark",
  "calendar",
  "people",
  "football",
  "location",
  "call",
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

const isOverviewIconName = (value: unknown): value is ActivityOverviewItem["icon"] =>
  typeof value === "string" &&
  OVERVIEW_ICON_NAMES.includes(value as ActivityOverviewItem["icon"]);

const asString = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
};

const asStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) =>
    typeof item === "string" && item.trim().length > 0 ? [item] : []
  );
};

const toOverviewItems = (
  raw: Record<string, unknown>,
  location: string,
  rating: string
): ActivityOverviewItem[] => {
  if (Array.isArray(raw.overview)) {
    const overviewItems = raw.overview.flatMap((item) => {
      if (!isRecord(item)) {
        return [];
      }

      const icon = item.icon;
      const text = asString(item.text).trim();

      if (!isOverviewIconName(icon) || !text) {
        return [];
      }

      return [{ icon, text }];
    });

    if (overviewItems.length) {
      return overviewItems;
    }
  }

  const schedule = asString(raw.schedule).trim();
  const phone = asString(raw.phone ?? raw.contactNumber ?? raw.mobile).trim();
  const ageGroup = asString(raw.ageGroup ?? raw.ageRange ?? raw.ages).trim();
  const category = asString(raw.category ?? raw.type ?? raw.mood).trim();
  const overview: ActivityOverviewItem[] = [];

  if (location) {
    overview.push({ icon: "location", text: `Location: ${location}` });
  }

  if (schedule) {
    overview.push({ icon: "calendar", text: schedule });
  }

  if (ageGroup) {
    overview.push({ icon: "people", text: `Age group: ${ageGroup}` });
  }

  if (category) {
    overview.push({ icon: "football", text: `Category: ${category}` });
  }

  if (phone) {
    overview.push({ icon: "call", text: `Call ${phone}` });
  }

  if (rating) {
    overview.push({ icon: "shield-checkmark", text: `Rating: ${rating}` });
  }

  return overview.length
    ? overview
    : [{ icon: "shield-checkmark", text: "Details will be available soon." }];
};

const toDetailsInfo = (raw: Record<string, unknown>): ActivityDetailsInfo => ({
  description: asString(
    raw.description ?? raw.details ?? raw.about,
    "No description available yet."
  ),
  amenities: asStringArray(raw.amenities),
  schedule: asString(raw.schedule, "Schedule will be shared soon."),
});

const toCosts = (
  raw: Record<string, unknown>,
  fallbackImage: string
): ActivityCost[] => {
  if (Array.isArray(raw.costs)) {
    const costs = raw.costs.flatMap((item) => {
      if (!isRecord(item)) {
        return [];
      }

      const label = asString(item.label ?? item.title).trim();
      const price = asString(item.price ?? item.amount).trim();

      if (!label || !price) {
        return [];
      }

      return [
        {
          label,
          price,
          image: asString(item.image ?? item.imageUrl, fallbackImage),
        },
      ];
    });

    if (costs.length) {
      return costs;
    }
  }

  const price = asString(raw.price ?? raw.cost ?? raw.fee).trim();

  return price
    ? [{ label: "Registration", price, image: fallbackImage }]
    : [];
};

const toReviews = (raw: Record<string, unknown>): ActivityReview[] => {
  if (!Array.isArray(raw.reviews)) {
    return [];
  }

  return raw.reviews.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    const name = asString(item.name, "Anonymous");
    const rating = Number(item.rating);
    const comment = asString(item.comment).trim();

    if (!comment) {
      return [];
    }

    return [
      {
        name,
        rating: Number.isFinite(rating) ? rating : 0,
        comment,
      },
    ];
  });
};

const normalizeActivityDetails = (value: unknown): ActivityDetailsRecord | null => {
  if (!isRecord(value)) {
    return null;
  }

  const id = asString(value.id ?? value.firestoreId).trim();

  if (!id) {
    return null;
  }

  const title = asString(value.title, "Untitled activity");
  const location = asString(value.location);
  const image = asString(value.image ?? value.imageUrl, FALLBACK_IMAGE);
  const rating = asString(value.rating).trim();

  return {
    id,
    title,
    location,
    image,
    overview: toOverviewItems(value, location, rating),
    details: toDetailsInfo(value),
    costs: toCosts(value, image),
    reviews: toReviews(value),
  };
};

export default function ActivityDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ActivityTabName>("Overview");
  const [activity, setActivity] = useState<ActivityDetailsRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const activityId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        console.log("Route activityId =", activityId);

        if (!activityId || typeof activityId !== "string") {
          setActivity(null);
          return;
        }

        const data = await getActivityById(activityId);
        console.log("Fetched activity =", data);
        setActivity(normalizeActivityDetails(data));
      } catch (error) {
        console.log("Fetch activity error:", error);
        setActivity(null);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [activityId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={BLUE} />
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
              pathname: "/booking-form",
              params: {
                activity: activity.title,
                activityId: activity.id,
              },
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
