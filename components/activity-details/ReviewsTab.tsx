import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import styles from "@/style/reviewsTabStyles";
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
          router.push({
            pathname: "/review",
            params: {
              activityId: activity.id,
              rating: "0",
            },
          })
        }
        style={styles.rateButtonCustom}
      />
    </View>
  );
}

