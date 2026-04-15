import React from "react";
import { TouchableOpacity, Text, ViewStyle, TextStyle } from "react-native";
import styles from "@/style/primaryButtonStyles";

type Props = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  activeOpacity?: number;
};

export default function PrimaryButton({
  title,
  onPress,
  style,
  textStyle,
  activeOpacity = 0.85,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={activeOpacity}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}