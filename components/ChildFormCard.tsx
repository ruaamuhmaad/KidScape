import { Ionicons } from "@expo/vector-icons";
import { type ComponentProps } from "react";
import { Controller, type Control } from "react-hook-form";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export type ChildFormValues = {
  fullName: string;
  city: string;
  gender: string;
  dateOfBirth: string;
};

export type DropdownField = "city" | "gender";

type InterestIconName = ComponentProps<typeof Ionicons>["name"];

export const EMPTY_CHILD_FORM: ChildFormValues = {
  fullName: "",
  city: "",
  gender: "",
  dateOfBirth: "",
};

const CITY_OPTIONS = ["Jerusalem", "Ramallah", "Nablus", "Hebron", "Bethlehem"];
const GENDER_OPTIONS = ["Male", "Female"];
const INTEREST_OPTIONS: { label: string; icon: InterestIconName }[] = [
  { label: "Drawing", icon: "brush-outline" },
  { label: "Football", icon: "football-outline" },
  { label: "Basketball", icon: "basketball-outline" },
  { label: "Swimming", icon: "water-outline" },
  { label: "Martial Arts", icon: "shield-outline" },
  { label: "Gymnastics", icon: "accessibility-outline" },
  { label: "Singing", icon: "musical-notes-outline" },
];

type Props = {
  control: Control<ChildFormValues>;
  openDropdown: DropdownField | null;
  selectedInterests: string[];
  isSaving: boolean;
  errorMessage: string;
  onToggleDropdown: (field: DropdownField) => void;
  onCloseDropdown: () => void;
  onToggleInterest: (interest: string) => void;
  onCancel: () => void;
  onCreate: () => void;
};

export default function ChildFormCard({
  control,
  openDropdown,
  selectedInterests,
  isSaving,
  errorMessage,
  onToggleDropdown,
  onCloseDropdown,
  onToggleInterest,
  onCancel,
  onCreate,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>My child</Text>

      <Controller
        control={control}
        name="fullName"
        rules={{
          required: "Child name is required.",
          minLength: {
            value: 2,
            message: "Child name must be at least 2 characters.",
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <FormInput
            label="Full name"
            placeholder="enter child name"
            value={value}
            errorMessage={error?.message}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="city"
        rules={{ required: "Please select a city." }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <SelectField
            label="City"
            placeholder="select city"
            value={value}
            options={CITY_OPTIONS}
            isOpen={openDropdown === "city"}
            errorMessage={error?.message}
            onToggle={() => onToggleDropdown("city")}
            onSelect={(selectedValue) => {
              onChange(selectedValue);
              onCloseDropdown();
            }}
          />
        )}
      />

      <Controller
        control={control}
        name="gender"
        rules={{ required: "Please select a gender." }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <SelectField
            label="Gender"
            placeholder="select gender"
            value={value}
            options={GENDER_OPTIONS}
            isOpen={openDropdown === "gender"}
            errorMessage={error?.message}
            onToggle={() => onToggleDropdown("gender")}
            onSelect={(selectedValue) => {
              onChange(selectedValue);
              onCloseDropdown();
            }}
          />
        )}
      />

      <Controller
        control={control}
        name="dateOfBirth"
        rules={{
          required: "Date of birth is required.",
          pattern: {
            value: /^\d{4}-\d{2}-\d{2}$/,
            message: "Use the YYYY-MM-DD format.",
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <FormInput
            label="Date of birth"
            placeholder="YYYY-MM-DD"
            value={value}
            errorMessage={error?.message}
            onChangeText={onChange}
          />
        )}
      />

      <Text style={styles.label}>Interests & Hobbies</Text>
      <View style={styles.interestsList}>
        {INTEREST_OPTIONS.map((interest) => (
          <InterestOption
            key={interest.label}
            option={interest}
            isSelected={selectedInterests.includes(interest.label)}
            onPress={() => onToggleInterest(interest.label)}
          />
        ))}
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.createBtn, isSaving && styles.createBtnDisabled]}
          onPress={onCreate}
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
  );
}

type FormInputProps = {
  label: string;
  placeholder: string;
  value: string;
  errorMessage?: string;
  onChangeText: (value: string) => void;
};

const FormInput = ({
  label,
  placeholder,
  value,
  errorMessage,
  onChangeText,
}: FormInputProps) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#6C7A89"
      style={styles.input}
    />
    {errorMessage ? <Text style={styles.fieldErrorText}>{errorMessage}</Text> : null}
  </View>
);

type SelectFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  isOpen: boolean;
  errorMessage?: string;
  onToggle: () => void;
  onSelect: (value: string) => void;
};

const SelectField = ({
  label,
  placeholder,
  value,
  options,
  isOpen,
  errorMessage,
  onToggle,
  onSelect,
}: SelectFieldProps) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.dropdownWrapper}>
      <TouchableOpacity style={styles.dropdown} onPress={onToggle}>
        <Text style={[styles.dropdownText, value && styles.dropdownValue]}>
          {value || placeholder}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={18}
          color="#6C7A89"
        />
      </TouchableOpacity>

      {isOpen ? (
        <View style={styles.optionsList}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.optionItem}
              onPress={() => onSelect(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
    {errorMessage ? <Text style={styles.fieldErrorText}>{errorMessage}</Text> : null}
  </>
);

type InterestOptionProps = {
  option: { label: string; icon: InterestIconName };
  isSelected: boolean;
  onPress: () => void;
};

const InterestOption = ({
  option,
  isSelected,
  onPress,
}: InterestOptionProps) => (
  <TouchableOpacity
    style={[styles.checkboxItem, isSelected && styles.checkboxItemSelected]}
    onPress={onPress}
  >
    <View style={styles.checkboxLeft}>
      <Ionicons
        name={isSelected ? "checkbox" : "square-outline"}
        size={22}
        color="#1E3A46"
      />
      <Ionicons name={option.icon} size={18} color="#1E3A46" />
      <Text style={styles.checkboxText}>{option.label}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#DCE3E7",
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 20,
  },

  sectionTitle: {
    color: "#1E3A46",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 15,
  },

  label: {
    color: "#1E3A46",
    fontSize: 12,
    fontWeight: "400",
    marginBottom: 5,
  },

  inputContainer: {
    gap: 0,
  },

  input: {
    backgroundColor: "#F4F6F8",
    borderRadius: 20,
    borderWidth: 0,
    fontSize: 12,
    marginBottom: 6,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  dropdownWrapper: {
    marginBottom: 6,
  },

  dropdown: {
    alignItems: "center",
    backgroundColor: "#F4F6F8",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },

  dropdownText: {
    color: "#6C7A89",
    fontSize: 12,
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
    borderBottomColor: "#D7DEE3",
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },

  optionText: {
    color: "#1E3A46",
    fontSize: 12,
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
    borderColor: "#1E3A46",
    borderWidth: 1,
  },

  checkboxLeft: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },

  checkboxText: {
    color: "#1E3A46",
    fontSize: 13,
  },

  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancelBtn: {
    backgroundColor: "#6C8A96",
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },

  cancelText: {
    color: "#fff",
    fontSize: 12,
  },

  createBtn: {
    alignItems: "center",
    backgroundColor: "#1E3A46",
    borderRadius: 20,
    minWidth: 95,
    paddingHorizontal: 30,
    paddingVertical: 12,
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

  fieldErrorText: {
    color: "#B42318",
    fontSize: 11,
    marginBottom: 8,
  },
});
