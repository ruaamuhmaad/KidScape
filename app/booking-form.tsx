import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import styles from "@/style/bookingFormStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { submitBooking } from "@/firebase/bookingService";
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

 const handleSubmit = async () => {
     if (!parentName || !phone || !childName || !age || !agree) {
       alert("Please fill the required fields.");
       return;
     }

     try {
       await submitBooking({
         activity: String(activity),
         parentName,
         phone,
         email,
         childName,
         age,
         notes,
         medicalInfo,
       });

       router.push({
         pathname: "/booking-submitted",
         params: {
           activity,
           parentName,
           childName,
         },
       });
     } catch (error) {
       console.log("Booking submit error:", error);
       alert("Something went wrong. Please try again.");
     }
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

   <PrimaryButton
     title="Submit Booking Request"
     onPress={handleSubmit}
     style={styles.submitButtonCustom}
   />
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

