import React from "react";
import { View, Text, Image } from "react-native";
import styles from "@/style/costsTabStyles";
import type { ActivityDetailsRecord } from "./types";

type CostsTabProps = {
  activity: ActivityDetailsRecord;
};

export default function CostsTab({ activity }: CostsTabProps) {
  return (
    <View style={styles.tabContent}>
      {activity.costs.map((cost, i) => (
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
