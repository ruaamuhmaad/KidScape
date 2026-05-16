import BottomNav from "@/components/bottom-nav";
import ProfileHeader from "@/components/ProfileHeader";
import {
  pickImageFromGallery,
  takePhotoWithCamera,
  uploadImageToCloudinary,
} from "@/firebase";
import {
  useCurrentProfile,
  useUpdateProfile,
} from "@/hooks/useProfileQueries";
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
  type ProfileInputKey,
} from "@/utils/profileForm";
import type { ImagePickerAsset } from "expo-image-picker";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

type ImageGetter = () => Promise<ImagePickerAsset | null>;

const getProfileFieldRules = (key: ProfileInputKey) => {
  switch (key) {
    case "email":
      return {
        required: "Email is required.",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Please enter a valid email address.",
        },
      };
    case "phone":
    case "emergencyContact":
      return {
        required: "Phone number is required.",
        pattern: {
          value: /^[0-9+]{8,15}$/,
          message: "Please enter a valid phone number.",
        },
      };
    default:
      return {
        required: `${key === "parentName" ? "Parent name" : "Address"} is required.`,
      };
  }
};

const getProfileKeyboardType = (
  key: ProfileInputKey
): TextInputProps["keyboardType"] => {
  if (key === "email") {
    return "email-address";
  }

  if (key === "phone" || key === "emergencyContact") {
    return "phone-pad";
  }

  return "default";
};

export default function Profile() {
  const { control, getValues, handleSubmit, reset, setValue, watch } =
    useForm<ProfileForm>({
      defaultValues: EMPTY_PROFILE_FORM,
      mode: "onChange",
    });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [localErrorMessage, setLocalErrorMessage] = useState("");
  const profileQuery = useCurrentProfile();
  const updateProfileMutation = useUpdateProfile();
  const profilePreview = watch();

  useEffect(() => {
    if (!profileQuery.data) {
      return;
    }

    reset(mapProfileToForm(profileQuery.data));
    setLocalErrorMessage("");
  }, [profileQuery.data, reset]);

  const queryErrorMessage = useMemo(
    () =>
      profileQuery.error
        ? getErrorMessage(
            profileQuery.error,
            "Unable to load your profile right now."
          )
        : "",
    [profileQuery.error]
  );

  useEffect(() => {
    if (queryErrorMessage) {
      redirectToLoginIfNeeded(queryErrorMessage);
    }
  }, [queryErrorMessage]);

  const errorMessage = useMemo(() => {
    if (localErrorMessage) {
      return localErrorMessage;
    }

    if (queryErrorMessage) {
      return queryErrorMessage;
    }

    return updateProfileMutation.error
      ? getErrorMessage(
          updateProfileMutation.error,
          "Unable to save your profile right now."
        )
      : "";
  }, [localErrorMessage, queryErrorMessage, updateProfileMutation.error]);

  const saveProfile = useCallback(
    (nextForm: ProfileForm) =>
      updateProfileMutation.mutateAsync(buildProfilePayload(nextForm)),
    [updateProfileMutation]
  );

  const handleSave = useCallback(async (form: ProfileForm) => {
    try {
      setLocalErrorMessage("");
      await saveProfile(form);
      Alert.alert("Saved", "Profile updated successfully.");
      router.push("/profile");
    } catch (error) {
      setLocalErrorMessage(
        getErrorMessage(error, "Unable to save your profile right now.")
      );
    }
  }, [saveProfile]);

  const selectAndUploadProfileImage = useCallback(async (getImage: ImageGetter) => {
    try {
      setIsUploadingImage(true);
      setLocalErrorMessage("");

      const asset = await getImage();
      if (!asset) return;

      const imageUrl = await uploadImageToCloudinary(asset);
      const nextForm = { ...getValues(), imageUrl };

      setValue("imageUrl", imageUrl, { shouldDirty: true });
      await saveProfile(nextForm);
    } catch (error) {
      setLocalErrorMessage(
        getErrorMessage(error, "Unable to upload your profile photo right now.")
      );
    } finally {
      setIsUploadingImage(false);
    }
  }, [getValues, saveProfile, setValue]);

  const handlePickProfileImage = useCallback(() => {
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
  }, [selectAndUploadProfileImage]);

  const submitProfile = useCallback(() => {
    void handleSubmit(handleSave)();
  }, [handleSave, handleSubmit]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ProfileHeader
            name={profilePreview.parentName || undefined}
            imageUrl={profilePreview.imageUrl || undefined}
            onImagePress={handlePickProfileImage}
            isImageLoading={isUploadingImage}
          />

          {profileQuery.isLoading ? <LoadingState /> : null}
          {!profileQuery.isLoading && errorMessage ? (
            <Text style={styles.statusText}>{errorMessage}</Text>
          ) : null}

          <View style={styles.form}>
            {PROFILE_FIELDS.map((field) => (
              <Controller
                key={field.key}
                control={control}
                name={field.key}
                rules={getProfileFieldRules(field.key)}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <ProfileField
                    label={field.label}
                    value={value}
                    errorMessage={error?.message}
                    keyboardType={getProfileKeyboardType(field.key)}
                    onChangeText={onChange}
                  />
                )}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, updateProfileMutation.isPending && styles.disabled]}
            onPress={submitProfile}
            disabled={updateProfileMutation.isPending}
          >
            <Text style={styles.saveText}>
              {updateProfileMutation.isPending ? "Saving..." : "Save"}
            </Text>
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

type ProfileFieldProps = {
  label: string;
  value: string;
  errorMessage?: string;
  keyboardType?: TextInputProps["keyboardType"];
  onChangeText: (value: string) => void;
};

const ProfileField = ({
  label,
  value,
  errorMessage,
  keyboardType = "default",
  onChangeText,
}: ProfileFieldProps) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={`Enter ${label}`}
      placeholderTextColor="#6C7A89"
      keyboardType={keyboardType}
      autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
      style={styles.fieldInput}
    />
    {errorMessage ? <Text style={styles.fieldErrorText}>{errorMessage}</Text> : null}
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

  field: {
    gap: 6,
  },

  fieldLabel: {
    color: "#1E3A46",
    fontSize: 14,
    fontWeight: "500",
  },

  fieldInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D0D7DD",
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
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

  fieldErrorText: {
    color: "#B42318",
    fontSize: 11,
  },
});
