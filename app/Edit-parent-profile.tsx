import BottomNav from "@/components/bottom-nav";
import CustomInput from "@/components/CustomInput";
import ProfileHeader from "@/components/ProfileHeader";
import {
  pickImageFromGallery,
  takePhotoWithCamera,
  uploadImageToCloudinary,
} from "@/firebase";
import { getCurrentUserProfile, updateCurrentUserProfile } from "@/services/authService";
import {
  getErrorMessage,
  redirectToLoginIfNeeded,
} from "@/utils/errorHandling";
import {
  buildProfilePayload,
  EMPTY_PROFILE_FORM,
  mapProfileToForm,
  PROFILE_FIELDS,
  type ProfileForm,
} from "@/utils/profileForm";
import type { ImagePickerAsset } from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ImageGetter = () => Promise<ImagePickerAsset | null>;

export default function Profile() {
  const [form, setForm] = useState<ProfileForm>(EMPTY_PROFILE_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadParentData = async () => {
      try {
        const profile = await getCurrentUserProfile();
        if (isMounted) {
          setForm(mapProfileToForm(profile));
          setErrorMessage("");
        }
      } catch (error) {
        const message = getErrorMessage(
          error,
          "Unable to load your profile right now."
        );
        if (isMounted) setErrorMessage(message);
        redirectToLoginIfNeeded(message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadParentData();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateField = (key: keyof ProfileForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const saveProfile = (nextForm = form) =>
    updateCurrentUserProfile(buildProfilePayload(nextForm));

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMessage("");
      await saveProfile();
      Alert.alert("Saved", "Profile updated successfully.");
      router.push("/profile");
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Unable to save your profile right now.")
      );
    } finally {
      setIsSaving(false);
    }
  };

  const selectAndUploadProfileImage = async (getImage: ImageGetter) => {
    try {
      setIsUploadingImage(true);
      setErrorMessage("");

      const asset = await getImage();
      if (!asset) return;

      const imageUrl = await uploadImageToCloudinary(asset);
      const nextForm = { ...form, imageUrl };

      setForm(nextForm);
      await saveProfile(nextForm);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Unable to upload your profile photo right now.")
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handlePickProfileImage = () => {
    Alert.alert("Profile photo", "Choose image source", [
      {
        text: "Gallery",
        onPress: () => void selectAndUploadProfileImage(pickImageFromGallery),
      },
      {
        text: "Camera",
        onPress: () => void selectAndUploadProfileImage(takePhotoWithCamera),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ProfileHeader
            name={form.parentName || undefined}
            imageUrl={form.imageUrl || undefined}
            onImagePress={handlePickProfileImage}
            isImageLoading={isUploadingImage}
          />

          {isLoading ? <LoadingState /> : null}
          {!isLoading && errorMessage ? (
            <Text style={styles.statusText}>{errorMessage}</Text>
          ) : null}

          <View style={styles.form}>
            {PROFILE_FIELDS.map((field) => (
              <CustomInput
                key={field.key}
                label={field.label}
                value={form[field.key]}
                onChangeText={(value) => updateField(field.key, value)}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, isSaving && styles.disabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={styles.saveText}>{isSaving ? "Saving..." : "Save"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomNav />
    </SafeAreaView>
  );
}

const LoadingState = () => (
  <View style={styles.statusContainer}>
    <ActivityIndicator color="#1E3A46" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  statusContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: -10,
  },

  statusText: {
    color: "#6C7A89",
    marginBottom: 20,
    marginTop: -10,
    textAlign: "center",
  },

  form: {
    gap: 15,
    marginTop: 10,
  },

  saveBtn: {
    alignItems: "center",
    backgroundColor: "#1E3A46",
    borderRadius: 12,
    marginTop: 30,
    padding: 16,
  },

  disabled: {
    opacity: 0.7,
  },

  saveText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
