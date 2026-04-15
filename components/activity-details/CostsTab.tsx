import React from "react";
import { View, Text, Image } from "react-native";
import styles from "@/style/costsTabStyles";

export default function CostsTab({ activity }) {
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