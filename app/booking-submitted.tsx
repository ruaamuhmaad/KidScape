import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import styles from "@/style/bookingSubmittedStyles";
import PrimaryButton from "@/components/ui/PrimaryButton";
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
              <View style={[styles.summaryIcon, { backgroundColor: "#ECFDF3" }]}>
                <Ionicons name="time-outline" size={16} color="#16A34A" />
              </View>
              <View>
                <Text style={styles.summaryLabel}>Status</Text>
                <Text style={styles.summaryValue}>Pending confirmation</Text>
              </View>
            </View>
          </View>

       <PrimaryButton
         title="Back to Home"
         onPress={() => router.replace("/")}
         style={styles.mainButtonCustom}
       />


        </View>

        <View style={styles.helpBox}>
          <Text style={styles.helpText}>Need help?</Text>
          <Text style={styles.supportText}>Contact Support</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

