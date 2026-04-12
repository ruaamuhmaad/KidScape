import React from "react";
import { View, Text, StyleSheet } from "react-native";
import OverviewIcon from "./OverviewIcon";

export default function OverviewTab({ activity }) {
  return (
    <View style={styles.tabContent}>
      {activity.overview.map((item, i) => (
        <View key={i} style={styles.overviewRow}>
          <View style={styles.iconBox}>
            <OverviewIcon name={item.icon} />
          </View>

          <Text style={styles.text}>
            {item.text}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    marginHorizontal: 16,
    marginTop: 18,
  },

  overviewRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEF6FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  text: {
    flex: 1,
    fontSize: 14.5,
    color: "#333",
    lineHeight: 21,
  },
});