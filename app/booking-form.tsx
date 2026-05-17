import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import styles from "@/style/bookingFormStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { submitBooking } from "@/firebase/bookingService";
import { getFirebaseAuth } from "@/firebase/config";

type BookingFormValues = {
  parentName: string;
  phone: string;
  email: string;
  childName: string;
  age: string;
  notes: string;
  medicalInfo: string;
  agree: boolean;
};

export default function BookingFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const activity = params.activity || "Sport Village";

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormValues>({
    defaultValues: {
      parentName: "",
      phone: "",
      email: "",
      childName: "",
      age: "",
      notes: "",
      medicalInfo: "",
      agree: false,
    },
  });

  const agree = watch("agree");

  const onSubmit = async (data: BookingFormValues) => {
    try {
      const auth = getFirebaseAuth();
      const userId = auth.currentUser?.uid;

      if (!userId) {
        alert("You must be logged in to book an activity.");
        return;
      }

      await submitBooking(userId, {
        activity: String(activity),
        parentName: data.parentName,
        phone: data.phone,
        email: data.email,
        childName: data.childName,
        age: data.age,
        notes: data.notes,
        medicalInfo: data.medicalInfo,
      });

      router.push({
        pathname: "/booking-submitted",
        params: {
          activity,
          parentName: data.parentName,
          childName: data.childName,
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

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={20}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
              <Ionicons name="arrow-back" size={22} color="#1F2937" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Booking Form</Text>

            <View style={{ width: 32 }} />
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.content, { paddingBottom: 120 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.sectionTitle}>Parent Information</Text>

            <Controller
              control={control}
              name="parentName"
              rules={{ required: "Full name is required" }}
              render={({ field: { value, onChange } }) => (
                <InputField
                  icon="person-outline"
                  placeholder="Full Name"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.parentName && (
              <Text style={styles.errorText}>{errors.parentName.message}</Text>
            )}

            <Controller
              control={control}
              name="phone"
              rules={{ required: "Phone number is required" }}
              render={({ field: { value, onChange } }) => (
                <InputField
                  icon="call-outline"
                  placeholder="Phone Number"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                />
              )}
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone.message}</Text>
            )}

            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <InputField
                  icon="mail-outline"
                  placeholder="Email Address"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                />
              )}
            />

            <Text style={styles.sectionTitle}>Child Information</Text>

            <Controller
              control={control}
              name="childName"
              rules={{ required: "Child name is required" }}
              render={({ field: { value, onChange } }) => (
                <InputField
                  icon="happy-outline"
                  placeholder="Child Name"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.childName && (
              <Text style={styles.errorText}>{errors.childName.message}</Text>
            )}

            <Controller
              control={control}
              name="age"
              rules={{ required: "Age is required" }}
              render={({ field: { value, onChange } }) => (
                <InputField
                  icon="calendar-outline"
                  placeholder="Age"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                />
              )}
            />
            {errors.age && (
              <Text style={styles.errorText}>{errors.age.message}</Text>
            )}

            <Text style={styles.sectionTitle}>Additional Information</Text>

            <Controller
              control={control}
              name="notes"
              render={({ field: { value, onChange } }) => (
                <InputField
                  icon="document-text-outline"
                  placeholder="Notes (Optional)"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  height={90}
                />
              )}
            />

            <Controller
              control={control}
              name="medicalInfo"
              render={({ field: { value, onChange } }) => (
                <InputField
                  icon="warning-outline"
                  placeholder="Medical condition or allergy (Optional)"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  height={90}
                />
              )}
            />

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setValue("agree", !agree)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
                {agree && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>

              <Text style={styles.checkboxText}>
                I agree to send this booking request to the activity provider
              </Text>
            </TouchableOpacity>

            {!agree && errors.agree && (
              <Text style={styles.errorText}>{errors.agree.message}</Text>
            )}

            <Controller
              control={control}
              name="agree"
              rules={{
                validate: (value) =>
                  value === true || "You must agree before submitting",
              }}
              render={() => <View />}
            />

            <PrimaryButton
              title="Submit Booking Request"
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButtonCustom}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
}: {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "phone-pad" | "email-address" | "numeric";
  multiline?: boolean;
  height?: number;
}) {
  return (
    <View style={[styles.inputWrapper, multiline && { height }]}>
      <Ionicons
        name={icon}
        size={18}
        color="#94A3B8"
        style={styles.inputIcon}
      />

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