import React from "react";
import { View, Text, Image, TouchableOpacity ,Alert,  } from "react-native";
import styles from "@/style/costsTabStyles";
import type { ActivityDetailsRecord } from "./types";
import { useRouter } from "expo-router";
import { getCurrentUser } from "@/firebase/login";
type CostsTabProps = {
  activity: ActivityDetailsRecord;
};

export default function CostsTab({ activity }: CostsTabProps) {
  const router = useRouter();

  return (
    <View style={styles.tabContent}>
      {activity.costs.map((cost, i) => (
        <TouchableOpacity
          key={i}
          style={styles.costCard}
          onPress={() =>{
               const user = getCurrentUser();

                if (!user) {
                  Alert.alert(
                    "Login Required",
                    "You must be logged in to register for this plan.",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Login", onPress: () => router.push("/login") },
                    ]
                  );
                  return;
                }
   router.push({
             pathname: "/cost-details/[activityId]/[costIndex]",
             params: {
               activityId: activity.id,
               costIndex: i,
             },
           })
              }


          }
        >
          <Image
            source={{ uri: cost.image }}
            style={styles.costImage}
            resizeMode="cover"
          />
          <Text style={styles.costLabel}>{cost.label}</Text>
          <Text style={styles.costPrice}>{cost.price}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}