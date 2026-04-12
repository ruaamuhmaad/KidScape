import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function BookingSubmittedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const activity = params.activity || "Sport Village";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F8FA" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Submitted</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={32} color="#16A34A" />
          </View>

          <Text style={styles.title}>Booking Request Sent Successfully</Text>

          <Text style={styles.description}>
            Your request has been submitted. We will contact you soon to confirm
            the suitable schedule for your child.
          </Text>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>

            <View style={styles.summaryRow}>
              <View style={[styles.summaryIcon, { backgroundColor: "#EEF4FF" }]}>
                <Ionicons name="football-outline" size={16} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.summaryLabel}>Activity</Text>
                <Text style={styles.summaryValue}>{activity}</Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <View style={[styles.summaryIcon, { backgroundColor: "#ECFDF3" }]}>
                <Ionicons name="time-outline" size={16} color="#16A34A" />
              </View>
              <View>
                <Text style={styles.summaryLabel}>Status</Text>
                <Text style={styles.summaryValue}>Pending confirmation</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.mainButtonText}>Back to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/ActivityDetails/1")}
            activeOpacity={0.8}
          >
            <Text style={styles.linkText}>View Activity Details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.helpBox}>
          <Text style={styles.helpText}>Need help?</Text>
          <Text style={styles.supportText}>Contact Support</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  header: {
    height: 56,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  iconBtn: {
    width: 32,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  container: {
    flex: 1,
    padding: 18,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  successCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 28/1.6,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  summaryBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  mainButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 14,
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  linkText: {
    textAlign: "center",
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },
  helpBox: {
    marginTop: 22,
    alignItems: "center",
  },
  helpText: {
    fontSize: 12,
    color: "#94A3B8",
  },
  supportText: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "600",
    marginTop: 4,
  },
});