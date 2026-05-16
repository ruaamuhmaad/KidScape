import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";

type Props = TextInputProps & {
  label: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export default function CustomInput({
  label,
  containerStyle,
  labelStyle,
  inputStyle,
  placeholder,
  ...inputProps
}: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <TextInput
        {...inputProps}
        placeholder={placeholder ?? `Enter ${label}`}
        style={[styles.input, inputStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },

  label: {
    color: "#1E3A46",
    fontSize: 14,
    fontWeight: "500",
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D0D7DD",
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },
});
