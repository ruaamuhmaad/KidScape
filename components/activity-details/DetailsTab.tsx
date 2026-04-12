import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DetailsTab({ activity }) {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.sectionLabel}>About</Text>

      <Text style={styles.detailText}>
        {activity.details.description}
      </Text>

      <Text style={[styles.sectionLabel, { marginTop: 18 }]}>
        Amenities
      </Text>

      <View style={styles.amenitiesGrid}>
        {activity.details.amenities.map((item, i) => (
          <View key={i} style={styles.amenityChip}>
            <Text style={styles.amenityChipText}>{item}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionLabel, { marginTop: 18 }]}>
        Schedule
      </Text>

      <Text style={styles.detailText}>
        {activity.details.schedule}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    marginHorizontal: 16,
    marginTop: 18,
  },

  sectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
  },

  detailText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 21,
    marginTop: 6,
  },

  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },

  amenityChip: {
    backgroundColor: "#EEF6FA",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  amenityChipText: {
    fontSize: 13,
    color: "#2C6E8A",
    fontWeight: "600",
  },
});