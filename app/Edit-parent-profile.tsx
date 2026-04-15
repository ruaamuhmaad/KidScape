import { getUser, updateUser } from "@/api/editUserService";
import ProfileHeader from "@/components/ProfileHeader";
import BottomNav from "@/components/bottom-nav";
import { router } from "expo-router";
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
} from "react-native";

export default function Profile() {
  const userId = 1;
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadParentData = async () => {
      try {
        const user = await getUser(userId);

        if (!isMounted) {
          return;
        }

        setParentName(user.PName);
        setEmail(user.Email);
        setPhone(user.Phone);
        setAddress(user.Address);
        setEmergencyContact(user.EmergencyNumber);
        setImageUrl(user.imageUrl);
        setCity(user.City ?? user.Address.split(",")[0]?.trim() ?? "");
        setErrorMessage("");
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage(`Unable to load user ${userId} right now.`);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadParentData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMessage("");

      await updateUser(userId, {
        PName: parentName,
        imageUrl,
        Email: email,
        Phone: phone,
        Address: address,
        EmergencyNumber: emergencyContact,
        City: city,
      });

      Alert.alert("Saved", "Profile updated successfully.");
      router.push("/profile");
    } catch {
      setErrorMessage(`Unable to save user ${userId} right now.`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ProfileHeader name={parentName || undefined} imageUrl={imageUrl || undefined} />

        {isLoading ? (
          <View style={styles.statusContainer}>
            <ActivityIndicator color="#1E3A46" />
          </View>
        ) : null}

        {!isLoading && errorMessage ? (
          <Text style={styles.statusText}>{errorMessage}</Text>
        ) : null}

        <View style={styles.form}>
          <Input label="Parent Name" value={parentName} onChangeText={setParentName} />
          <Input label="Email" value={email} onChangeText={setEmail} />
          <Input label="Phone Number" value={phone} onChangeText={setPhone} />
          <Input label="Address" value={address} onChangeText={setAddress} />
          <Input
            label="Emergency Contact"
            value={emergencyContact}
            onChangeText={setEmergencyContact}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveText}>{isSaving ? "Saving..." : "Save"}</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const Input = ({ label, value, onChangeText }: any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={`Enter ${label}`}
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
