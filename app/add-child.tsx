import ProfileHeader from "@/components/ProfileHeader";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { type ComponentProps, useState } from "react";

import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const CITY_OPTIONS = ["Jerusalem", "Ramallah", "Nablus", "Hebron", "Bethlehem"];
const GENDER_OPTIONS = ["Male", "Female"];
type InterestIconName = ComponentProps<typeof Ionicons>["name"];

const INTEREST_OPTIONS: Array<{ label: string; icon: InterestIconName }> = [
  { label: "Drawing", icon: "brush-outline" },
  { label: "Football", icon: "football-outline" },
  { label: "Basketball", icon: "basketball-outline" },
  { label: "Swimming", icon: "water-outline" },
  { label: "Martial Arts", icon: "shield-outline" },
  { label: "Gymnastics", icon: "accessibility-outline" },
  { label: "Singing", icon: "musical-notes-outline" },
];

export default function AddChildScreen() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [openDropdown, setOpenDropdown] = useState<"city" | "gender" | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <ProfileHeader />

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>My first child</Text>

        {/* Full name */}
        <Text style={styles.label}>Full name</Text>
        <TextInput
          placeholder="enter child name"
          style={styles.input}
        />

        {/* City */}
        <Text style={styles.label}>City</Text>
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.dropdown}
            onPress={() =>
              setOpenDropdown((current) => (current === "city" ? null : "city"))
            }
          >
            <Text style={[styles.dropdownText, selectedCity && styles.dropdownValue]}>
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
              setOpenDropdown((current) => (current === "gender" ? null : "gender"))
            }
          >
            <Text
              style={[styles.dropdownText, selectedGender && styles.dropdownValue]}
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
          placeholder="enter"
          style={styles.input}
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
                  <Ionicons name={interest.icon} size={18} color="#1E3A46" />
                  <Text style={styles.checkboxText}>{interest.label}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Buttons */}
        <View style={styles.buttonsRow}>
            
          <TouchableOpacity style={styles.cancelBtn}
            onPress={() => router.push("/child-management")}>
            <Text style={styles.cancelText}>cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.createBtn}
             onPress={() => router.push("/child-list")}>
            <Text style={styles.createText}>create</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
  },

  createText: {
    color: "#fff",
    fontSize: 12,
  },
});
