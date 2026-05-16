import ProfileHeader from "@/components/ProfileHeader";
import BottomNav from "@/components/bottom-nav";
import { getChildById, updateChildInFirebase, type ChildData } from "@/firebase";
import { getCurrentUserProfile } from "@/services/authService";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const CITY_OPTIONS = ["Jerusalem", "Ramallah", "Nablus", "Hebron", "Bethlehem"];
const GENDER_OPTIONS = ["Male", "Female"];

export default function EditChildScreen() {
  const { id } = useLocalSearchParams();
  const childId = Array.isArray(id) ? id[0] : id;

  const [childName, setChildName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openDropdown, setOpenDropdown] = useState<"city" | "gender" | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadChildData = async () => {
      try {
        if (!childId || typeof childId !== 'string') {
          throw new Error("Child ID is required");
        }

        const profile = await getCurrentUserProfile();
        if (!profile.permissions.includes("children:manage")) {
          throw new Error("You do not have permission to manage children.");
        }

        const child = await getChildById(childId);
        if (!child) {
          throw new Error("Child not found");
        }

        if (child.parentId !== profile.uid) {
          throw new Error("You can only edit your own children");
        }

        if (!isMounted) return;

        setChildName(child.name);
        setDateOfBirth(child.dateOfBirth);
        setSelectedCity(child.city);
        setSelectedGender(child.gender);
        setImageUrl(child.imageUrl || "");
        setErrorMessage("");
      } catch (error) {
        if (!isMounted) return;

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load child data right now.";

        setErrorMessage(message);

        if (message.toLowerCase().includes("log in")) {
          router.replace("/login" as any);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadChildData();

    return () => {
      isMounted = false;
    };
  }, [childId]);

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

  const handleSave = async () => {
    const name = childName.trim();
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

      const updateData: Partial<ChildData> = {
        name,
        age,
        city: selectedCity,
        gender: selectedGender,
        dateOfBirth: normalizedDateOfBirth,
      };

      if (imageUrl.trim()) {
        updateData.imageUrl = imageUrl.trim();
      }

      await updateChildInFirebase(childId!, updateData, profile.uid);

      Alert.alert("Saved", "Child profile updated successfully.");
      router.push("/child-list");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to save child profile right now."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <ProfileHeader
            name="Edit Child Profile"
            imageUrl={imageUrl || undefined}
          />

          {isLoading ? (
            <View style={styles.statusContainer}>
              <ActivityIndicator color="#1E3A46" />
            </View>
          ) : null}

          {!isLoading && errorMessage ? (
            <Text style={styles.statusText}>{errorMessage}</Text>
          ) : null}

          <View style={styles.form}>
            <Input label="Child Name" value={childName} onChangeText={setChildName} />
            <Input label="Date of Birth" value={dateOfBirth} onChangeText={setDateOfBirth} placeholder="YYYY-MM-DD" />


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
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>

              {openDropdown === "city" && (
                <View style={styles.optionsList}>
                  {CITY_OPTIONS.map((city) => (
                    <TouchableOpacity
                      key={city}
                      activeOpacity={0.8}
                      style={[
                        styles.optionItem,
                        selectedCity === city && styles.optionItemSelected,
                      ]}
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
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>

              {openDropdown === "gender" && (
                <View style={styles.optionsList}>
                  {GENDER_OPTIONS.map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      activeOpacity={0.8}
                      style={[
                        styles.optionItem,
                        selectedGender === gender && styles.optionItemSelected,
                      ]}
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

            <Input label="Profile Image URL" value={imageUrl} onChangeText={setImageUrl} placeholder="https://..." />
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={styles.saveText}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomNav />
    </SafeAreaView>
  );
}

const Input = ({ label, value, onChangeText, placeholder }: any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder || `Enter ${label}`}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  statusContainer: {
    alignItems: "center",
    marginTop: -10,
    marginBottom: 20,
  },
  statusText: {
    textAlign: "center",
    color: "#6C7A89",
    marginTop: -10,
    marginBottom: 20,
  },
  form: {
    marginTop: 10,
    gap: 15,
  },
  inputContainer: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    color: "#1E3A46",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D0D7DD",
  },
  dropdownWrapper: {
    marginBottom: 12,
    position: "relative",
    zIndex: 10,
  },
  dropdown: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D0D7DD",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    color: "#6C7A89",
    fontSize: 14,
  },
  dropdownValue: {
    color: "#1E3A46",
  },
  dropdownArrow: {
    color: "#6C7A89",
    fontSize: 12,
  },
  optionsList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginTop: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D0D7DD",
    zIndex: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  optionItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  optionItemSelected: {
    backgroundColor: "#E8F2F7",
  },
  optionText: {
    color: "#1E3A46",
    fontSize: 14,
  },
  saveBtn: {
    marginTop: 30,
    backgroundColor: "#1E3A46",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
