import ChildFormCard, {
  EMPTY_CHILD_FORM,
  type ChildFormValues,
  type DropdownField,
} from "@/components/ChildFormCard";
import ProfileHeader from "@/components/ProfileHeader";
import { addChildToFirebase } from "@/firebase";
import {
  getCurrentUserProfile,
  type AuthenticatedUserProfile,
} from "@/services/authService";
import { calculateAge } from "@/utils/childDate";
import {
  getErrorMessage,
  redirectToLoginIfNeeded,
} from "@/utils/errorHandling";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function AddChildScreen() {
  const [form, setForm] = useState<ChildFormValues>(EMPTY_CHILD_FORM);
  const [openDropdown, setOpenDropdown] = useState<DropdownField | null>(null);
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
        if (isMounted) setParentProfile(profile);
      } catch (error) {
        const message = getErrorMessage(error, "Unable to load profile.");
        if (isMounted) setErrorMessage(message);
        redirectToLoginIfNeeded(message);
      }
    };

    void loadParentProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateForm = (key: keyof ChildFormValues, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleDropdown = (field: DropdownField) => {
    setOpenDropdown((current) => (current === field ? null : field));
  };

  const selectDropdownValue = (field: DropdownField, value: string) => {
    updateForm(field, value);
    setOpenDropdown(null);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  };

  const handleCreate = async () => {
    const name = form.fullName.trim();
    const dateOfBirth = form.dateOfBirth.trim();
    const age = calculateAge(dateOfBirth);

    if (!name || !form.city || !form.gender || !dateOfBirth) {
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
        city: form.city,
        gender: form.gender,
        dateOfBirth,
        interests: selectedInterests,
        parentId: profile.uid,
      });

      Alert.alert("Saved", "Child added successfully.");
      router.replace("/child-list");
    } catch (error) {
      const message = getErrorMessage(error, "Unable to add child right now.");
      setErrorMessage(message);
      redirectToLoginIfNeeded(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ProfileHeader
          name={parentProfile?.PName || undefined}
          imageUrl={parentProfile?.imageUrl || undefined}
        />

        <ChildFormCard
          form={form}
          openDropdown={openDropdown}
          selectedInterests={selectedInterests}
          isSaving={isSaving}
          errorMessage={errorMessage}
          onChange={updateForm}
          onToggleDropdown={toggleDropdown}
          onSelectDropdown={selectDropdownValue}
          onToggleInterest={toggleInterest}
          onCancel={() => router.push("/child-list")}
          onCreate={handleCreate}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  content: {
    flexGrow: 1,
    paddingBottom: 30,
    backgroundColor: "#F4F6F8",
  },
});
