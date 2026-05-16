import ChildFormCard, {
  EMPTY_CHILD_FORM,
  type ChildFormValues,
  type DropdownField,
} from "@/components/ChildFormCard";
import ProfileHeader from "@/components/ProfileHeader";
import { useAddChild } from "@/hooks/useChildrenQueries";
import { useCurrentProfile } from "@/hooks/useProfileQueries";
import { calculateAge } from "@/utils/childDate";
import {
  getErrorMessage,
  redirectToLoginIfNeeded,
} from "@/utils/errorHandling";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function AddChildScreen() {
  const { control, handleSubmit } = useForm<ChildFormValues>({
    defaultValues: EMPTY_CHILD_FORM,
    mode: "onChange",
  });
  const [openDropdown, setOpenDropdown] = useState<DropdownField | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  const parentProfileQuery = useCurrentProfile();
  const addChildMutation = useAddChild();

  useEffect(() => {
    if (!parentProfileQuery.error) {
      return;
    }

    redirectToLoginIfNeeded(
      getErrorMessage(parentProfileQuery.error, "Unable to load profile.")
    );
  }, [parentProfileQuery.error]);

  const toggleDropdown = useCallback((field: DropdownField) => {
    setOpenDropdown((current) => (current === field ? null : field));
  }, []);

  const closeDropdown = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  const toggleInterest = useCallback((interest: string) => {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  }, []);

  const errorMessage = useMemo(() => {
    if (submitErrorMessage) {
      return submitErrorMessage;
    }

    return parentProfileQuery.error
      ? getErrorMessage(parentProfileQuery.error, "Unable to load profile.")
      : "";
  }, [parentProfileQuery.error, submitErrorMessage]);

  const handleCreate = useCallback(async (form: ChildFormValues) => {
    const name = form.fullName.trim();
    const dateOfBirth = form.dateOfBirth.trim();
    const age = calculateAge(dateOfBirth);

    if (age === null) {
      setSubmitErrorMessage("Please enter a valid date of birth.");
      return;
    }

    try {
      setSubmitErrorMessage("");
      await addChildMutation.mutateAsync({
        name,
        age,
        city: form.city,
        gender: form.gender,
        dateOfBirth,
        interests: selectedInterests,
      });

      Alert.alert("Saved", "Child added successfully.");
      router.replace("/child-list");
    } catch (error) {
      const message = getErrorMessage(error, "Unable to add child right now.");
      setSubmitErrorMessage(message);
      redirectToLoginIfNeeded(message);
    }
  }, [addChildMutation, selectedInterests]);

  const submitForm = useCallback(() => {
    void handleSubmit(handleCreate)();
  }, [handleCreate, handleSubmit]);

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ProfileHeader
          name={parentProfileQuery.data?.PName || undefined}
          imageUrl={parentProfileQuery.data?.imageUrl || undefined}
        />

        <ChildFormCard
          control={control}
          openDropdown={openDropdown}
          selectedInterests={selectedInterests}
          isSaving={addChildMutation.isPending}
          errorMessage={errorMessage}
          onToggleDropdown={toggleDropdown}
          onCloseDropdown={closeDropdown}
          onToggleInterest={toggleInterest}
          onCancel={() => router.push("/child-list")}
          onCreate={submitForm}
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
