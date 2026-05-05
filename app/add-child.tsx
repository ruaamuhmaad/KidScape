import ProfileHeader from "@/components/ProfileHeader";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { addChildToFirebase } from "@/firebase";
import {
  getCurrentUserProfile,
  type AuthenticatedUserProfile,
} from "@/services/authService";
import { type ComponentProps, useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform
} from "react-native";

const CITY_OPTIONS = ["Jerusalem", "Ramallah", "Nablus", "Hebron", "Bethlehem"];
const GENDER_OPTIONS = ["Male", "Female"];
type InterestIconName = ComponentProps<typeof Ionicons>["name"];

const INTEREST_OPTIONS: { label: string; icon: InterestIconName }[] = [
  { label: "Drawing", icon: "brush-outline" },
  { label: "Football", icon: "football-outline" },
  { label: "Basketball", icon: "basketball-outline" },
  { label: "Swimming", icon: "water-outline" },
  { label: "Martial Arts", icon: "shield-outline" },
  { label: "Gymnastics", icon: "accessibility-outline" },
  { label: "Singing", icon: "musical-notes-outline" },
];

export default function AddChildScreen() {
  const [fullName, setFullName] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [openDropdown, setOpenDropdown] = useState<"city" | "gender" | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [parentProfile, setParentProfile] =
    useState<AuthenticatedUserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadParentProfile = async () => {
      try {
        const profile = await getCurrentUserProfile();

        if (isMounted) {
          setParentProfile(profile);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to load profile.";

        if (isMounted) {
          setErrorMessage(message);
        }

        if (message.toLowerCase().includes("log in")) {
          router.replace("/login" as any);
        }
      }
    };

    loadParentProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const parseBirthDate = (value: string): Date | null => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (!match) {
      return null;
    }

    const [, year, month, day] = match;
    const birthDate = new Date(Number(year), Number(month) - 1, Number(day));

    if (
      birthDate.getFullYear() !== Number(year) ||
      birthDate.getMonth() !== Number(month) - 1 ||
      birthDate.getDate() !== Number(day) ||
      birthDate > new Date()
    ) {
      return null;
    }

    return birthDate;
  };

  const calculateAge = (value: string): number | null => {
    const birthDate = parseBirthDate(value);

    if (!birthDate) {
      return null;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age -= 1;
    }

    return age;
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  };

  const handleCreate = async () => {
    const name = fullName.trim();
    const normalizedDateOfBirth = dateOfBirth.trim();
    const age = calculateAge(normalizedDateOfBirth);

    if (!name || !selectedCity || !selectedGender || !normalizedDateOfBirth) {
      setErrorMessage("Please fill in all child information.");
      return;
    }

    if (age === null) {
      setErrorMessage("Please enter a valid date of birth.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      const profile = await getCurrentUserProfile();

      if (!profile.permissions.includes("children:manage")) {
        throw new Error("You do not have permission to manage children.");
      }

      await addChildToFirebase({
        name,
        age,
        city: selectedCity,
        gender: selectedGender,
        dateOfBirth: normalizedDateOfBirth,
        interests: selectedInterests,
        parentId: profile.uid,
      });

      Alert.alert("Saved", "Child added successfully.");
      router.replace("/child-list");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to add child right now.";

      setErrorMessage(message);

      if (message.toLowerCase().includes("log in")) {
        router.replace("/login" as any);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F4F6F8" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        contentContainerStyle={[styles.screen, { flexGrow: 1 }]}
        keyboardShouldPersistTaps="handled"
      >
        <ProfileHeader
          name={parentProfile?.PName || undefined}
          imageUrl={parentProfile?.imageUrl || undefined}
        />

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>My child</Text>

          {/* Full name */}
          <Text style={styles.label}>Full name</Text>
          <TextInput
            placeholder="enter child name"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />

          {/* City */}
          <Text style={styles.label}>City</Text>
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.dropdown}
              onPress={() =>
                setOpenDropdown((current) =>
                  current === "city" ? null : "city"
                )
              }
            >
              <Text
                style={[
                  styles.dropdownText,
                  selectedCity && styles.dropdownValue,
                ]}
              >
                {selectedCity || "select city"}
              </Text>
              <Ionicons
                name={openDropdown === "city" ? "chevron-up" : "chevron-down"}
                size={18}
                color="#6C7A89"
              />
            </TouchableOpacity>

            {openDropdown === "city" && (
              <View style={styles.optionsList}>
                {CITY_OPTIONS.map((city) => (
                  <TouchableOpacity
                    key={city}
                    style={styles.optionItem}
                    onPress={() => {
                      setSelectedCity(city);
                      setOpenDropdown(null);
                    }}
                  >
                    <Text style={styles.optionText}>{city}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Gender */}
          <Text style={styles.label}>Gender</Text>
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.dropdown}
              onPress={() =>
                setOpenDropdown((current) =>
                  current === "gender" ? null : "gender"
                )
              }
            >
              <Text
                style={[
                  styles.dropdownText,
                  selectedGender && styles.dropdownValue,
                ]}
              >
                {selectedGender || "select gender"}
              </Text>
              <Ionicons
                name={openDropdown === "gender" ? "chevron-up" : "chevron-down"}
                size={18}
                color="#6C7A89"
              />
            </TouchableOpacity>

            {openDropdown === "gender" && (
              <View style={styles.optionsList}>
                {GENDER_OPTIONS.map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={styles.optionItem}
                    onPress={() => {
                      setSelectedGender(gender);
                      setOpenDropdown(null);
                    }}
                  >
                    <Text style={styles.optionText}>{gender}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Date of birth */}
          <Text style={styles.label}>Date of birth</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            style={styles.input}
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
          />

          {/* Interests */}
          <Text style={styles.label}>Interests & Hobbies</Text>
          <View style={styles.interestsList}>
            {INTEREST_OPTIONS.map((interest) => {
              const isSelected = selectedInterests.includes(interest.label);

              return (
                <TouchableOpacity
                  key={interest.label}
                  activeOpacity={0.8}
                  style={[
                    styles.checkboxItem,
                    isSelected && styles.checkboxItemSelected,
                  ]}
                  onPress={() => toggleInterest(interest.label)}
                >
                  <View style={styles.checkboxLeft}>
                    <Ionicons
                      name={isSelected ? "checkbox" : "square-outline"}
                      size={22}
                      color="#1E3A46"
                    />
                    <Ionicons
                      name={interest.icon}
                      size={18}
                      color="#1E3A46"
                    />
                    <Text style={styles.checkboxText}>
                      {interest.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          {/* Buttons */}
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => router.push("/child-list")}
            >
              <Text style={styles.cancelText}>cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.createBtn,
                isSaving && styles.createBtnDisabled,
              ]}
              onPress={handleCreate}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.createText}>create</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: 30,
    backgroundColor: "#F4F6F8",
  },

  card: {
    backgroundColor: "#DCE3E7",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 15,
    color: "#1E3A46",
  },

  label: {
    fontSize: 12,
    marginBottom: 5,
    color: "#1E3A46",
  },

  input: {
    backgroundColor: "#F4F6F8",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 12,
  },

  dropdownWrapper: {
    marginBottom: 12,
  },

  dropdown: {
    backgroundColor: "#F4F6F8",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dropdownText: {
    fontSize: 12,
    color: "#6C7A89",
  },

  dropdownValue: {
    color: "#1E3A46",
  },

  optionsList: {
    backgroundColor: "#F4F6F8",
    borderRadius: 16,
    marginTop: 8,
    overflow: "hidden",
  },

  optionItem: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D7DEE3",
  },

  optionText: {
    fontSize: 12,
    color: "#1E3A46",
  },

  interestsList: {
    gap: 8,
    marginBottom: 20,
  },

  checkboxItem: {
    backgroundColor: "#F4F6F8",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  checkboxItemSelected: {
    borderWidth: 1,
    borderColor: "#1E3A46",
  },

  checkboxLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  checkboxText: {
    fontSize: 13,
    color: "#1E3A46",
  },

  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancelBtn: {
    backgroundColor: "#6C8A96",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },

  cancelText: {
    color: "#fff",
    fontSize: 12,
  },

  createBtn: {
    backgroundColor: "#1E3A46",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    minWidth: 95,
    alignItems: "center",
  },

  createBtnDisabled: {
    opacity: 0.7,
  },

  createText: {
    color: "#fff",
    fontSize: 12,
  },

  errorText: {
    color: "#B42318",
    fontSize: 12,
    marginBottom: 12,
    textAlign: "center",
  },
});
