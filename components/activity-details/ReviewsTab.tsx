import React from "react";
import { View, Text ,Alert, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import styles from "@/style/reviewsTabStyles";
import { getCurrentUser } from "@/firebase/login";
type Review = {
  rating: number;
  comment: string;
};

type Props = {
  activity: {
    id: string;
    reviews?: Review[];
  };
};

export default function ReviewsTab({ activity }: Props) {
  const router = useRouter();
  const reviews = activity?.reviews || [];

  return (
    <View style={styles.container}>
      {reviews.length === 0 ? (
        <Text style={styles.emptyText}>No reviews yet</Text>
      ) : (
        reviews.map((review, index) => (
          <View key={index} style={styles.reviewCard}>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= review.rating ? "star" : "star-outline"}
                  size={18}
                  color="#E7D27A"
                  style={styles.star}
                />
              ))}
            </View>

            <Text style={styles.commentText}>{review.comment}</Text>
          </View>
        ))
      )}

      <PrimaryButton
        title="Rate Us"
        onPress={() =>
            {
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
                            pathname: "/review",
                            params: {
                              activityId: activity.id,
                              rating: "0",
                            },
                          })

                }

        }
        style={styles.rateButtonCustom}
      />
    </View>
  );
}

