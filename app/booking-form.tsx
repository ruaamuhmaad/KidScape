import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function BookingFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const activity = params.activity || "Sport Village";

  const [parentName, setParentName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [childName, setChildName] = useState("");
  const [age, setAge] = useState("");
  const [notes, setNotes] = useState("");
  const [medicalInfo, setMedicalInfo] = useState("");
  const [agree, setAgree] = useState(false);

  const handleSubmit = () => {
    if (!parentName || !phone || !childName || !age || !agree) {
      alert("Please fill the required fields.");
      return;
    }

    router.push({
      pathname: "/(tabs)/booking-submitted",
      params: {
        activity,
        parentName,
        childName,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F8FA" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Form</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Ionicons name="football-outline" size={18} color="#2563EB" />
          </View>
          <Text style={styles.activityText}>{activity}</Text>
        </View>

        <Text style={styles.sectionTitle}>Parent Information</Text>

        <InputField
          icon="person-outline"
          placeholder="Full Name"
          value={parentName}
          onChangeText={setParentName}
        />

        <InputField
          icon="call-outline"
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <InputField
          icon="mail-outline"
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.sectionTitle}>Child Information</Text>

        <InputField
          icon="happy-outline"
          placeholder="Child Name"
          value={childName}
          onChangeText={setChildName}
        />

        <InputField
          icon="calendar-outline"
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <Text style={styles.sectionTitle}>Additional Information</Text>

        <InputField
          icon="document-text-outline"
          placeholder="Notes (Optional)"
          value={notes}
          onChangeText={setNotes}
          multiline
          height={90}
        />

        <InputField
          icon="warning-outline"
          placeholder="Medical condition or allergy (Optional)"
          value={medicalInfo}
          onChangeText={setMedicalInfo}
          multiline
          height={90}
        />

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAgree(!agree)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
            {agree && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <Text style={styles.checkboxText}>
            I agree to send this booking request to the activity provider
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Booking Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function InputField({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  multiline = false,
  height = 54,
}) {
  return (
    <View style={[styles.inputWrapper, multiline && { height }]}>
      <Ionicons name={icon} size={18} color="#94A3B8" style={styles.inputIcon} />
      <TextInput
        style={[
          styles.input,
          multiline && {
            height: height - 2,
            textAlignVertical: "top",
            paddingTop: 14,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
      />
    </View>
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
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  activityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  activityIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  activityText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
    marginTop: 4,
  },
  inputWrapper: {
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
    marginBottom: 18,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    marginRight: 10,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: "#475569",
  },
  submitButton: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
    shadowColor: "#2563EB",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});