import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import type { ActivityCost, ActivityDetailsRecord } from "./types";

type CostsTabProps = {
  activity: ActivityDetailsRecord;
};

export default function CostsTab({ activity }: CostsTabProps) {
  return (
    <View style={styles.tabContent}>
      {activity.costs.map((cost: ActivityCost, i: number) => (
        <View key={i} style={styles.costCard}>
          <Image
            source={{ uri: cost.image }}
            style={styles.costImage}
            resizeMode="cover"
          />

          <Text style={styles.costLabel}>{cost.label}</Text>

          <Text style={styles.costPrice}>{cost.price}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    marginHorizontal: 16,
    marginTop: 18,
    gap: 12,
  },

  costCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FBFD",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0eef4",
    overflow: "hidden",
  },

  costImage: {
    width: 70,
    height: 65,
  },

  costLabel: {
    flex: 1,
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "500",
    paddingHorizontal: 12,
  },

  costPrice: {
    fontSize: 14,
    color: "#2C6E8A",
    fontWeight: "700",
    paddingRight: 14,
  },
});
