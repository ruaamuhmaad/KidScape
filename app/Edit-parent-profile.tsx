import ProfileHeader from "@/components/ProfileHeader";
import BottomNav from "@/components/bottom-nav";
import { router } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
export default function Profile() {
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [childName, setChildName] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  const handleSave = () => {
    console.log({
      parentName,
      email,
      phone,
      address,
      childName,
      emergencyContact,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ProfileHeader />

        {/* Fields */}
        <View style={styles.form}>
          <Input label="Parent Name" value={parentName} onChangeText={setParentName} />
          <Input label="Email" value={email} onChangeText={setEmail} />
          <Input label="Phone Number" value={phone} onChangeText={setPhone} />
          <Input label="Address" value={address} onChangeText={setAddress} />
          <Input label="Child Name" value={childName} onChangeText={setChildName} />
          <Input label="City" value={childName} onChangeText={setChildName} />
          <Input
            label="Emergency Contact"
            value={emergencyContact}
            onChangeText={setEmergencyContact}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn}      
           onPress={() => router.push("/profile")}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

/* ---------- Reusable Input ---------- */

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

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
  saveText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});