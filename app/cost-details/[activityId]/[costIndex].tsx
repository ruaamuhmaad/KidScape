import React from "react";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getActivityById } from "@/firebase/activityDetailsService";
import { COLORS } from "@/constants/colors";
export default function CostDetailsScreen() {
  const { activityId, costIndex } = useLocalSearchParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const activity = await getActivityById(String(activityId));
        setData(activity);
      } catch (e) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [activityId]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.blue} />
      </SafeAreaView>
    );
  }

  const index = Number(costIndex);
  const cost = data?.costs?.[index];

  if (!cost) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Plan not found</Text>
      </SafeAreaView>
    );
  }

  const scheduleCards = [
    { label: "Days", value: data.schedule ?? "Sat – Thu" },
    { label: "Hours", value: "7 AM – 10 PM" },
    { label: "Duration", value: "1 Month" },
    { label: "Sessions", value: "Unlimited" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: "#e8e8e8",
      }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: "center", fontSize: 16, fontWeight: "600", color: "#1a1a1a" }}>
          Plan details
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>

        <View style={{ height: 200, justifyContent: "flex-end", padding: 16 }}>
          <Image
            source={{ uri: cost.image }}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          <View style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.45)"
          }} />
          <View style={{ position: "relative" }}>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#fff" }}>{cost.label}</Text>
            <Text style={{ fontSize: 13, color: "#9FE1CB", marginTop: 4 }}>{data.title} · {data.location}</Text>
          </View>
        </View>

        <View style={{ padding: 16, borderBottomWidth: 0.5, borderBottomColor: "#e8e8e8" }}>
          <Text style={{ fontSize: 30, fontWeight: "700", color: "#1a1a1a" }}>{cost.price}</Text>
          <Text style={{ fontSize: 13, color: "#777", marginTop: 6, lineHeight: 20 }}>
            {cost.description ?? "Full access included with this plan."}
          </Text>
        </View>

        <View style={{ padding: 16, borderBottomWidth: 0.5, borderBottomColor: "#e8e8e8" }}>
          <Text style={{ fontSize: 12, fontWeight: "600", color: "#999", letterSpacing: 0.5, marginBottom: 12, textTransform: "uppercase" }}>
            What's included
          </Text>
          {(cost.features ?? data.details?.amenities ?? []).map((item: string, i: number) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.blue} />
              <Text style={{ fontSize: 14, color: "#333" }}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: "600", color: "#999", letterSpacing: 0.5, marginBottom: 12, textTransform: "uppercase" }}>
            Schedule
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {scheduleCards.map((card, i) => (
              <View key={i} style={{
                width: "47%",
                backgroundColor: "#f5f5f5",
                borderRadius: 10,
                padding: 12,
              }}>
                <Text style={{ fontSize: 11, color: "#999", marginBottom: 3 }}>{card.label}</Text>
                <Text style={{ fontSize: 13, fontWeight: "600", color: "#1a1a1a" }}>{card.value}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      <View style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 0.5,
        borderTopColor: "#e8e8e8",
        backgroundColor: "#fff",
      }}>
        <TouchableOpacity
          onPress={() => router.push({
            pathname: "/booking-form",
            params: {
              activity: data.title,
              activityId: String(activityId),
              selectedPlan: cost.label,
              planPrice: cost.price,
            },
          })}
          style={{
            backgroundColor: COLORS.blue,
            paddingVertical: 15,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>
            Register for this plan
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}