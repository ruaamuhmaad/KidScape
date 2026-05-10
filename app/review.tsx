import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { submitReview } from "@/firebase/reviewService";

export default function ReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const activityId =
    typeof params.activityId === "string" ? params.activityId : "";
  const initialRating = Number(params.rating || 0);

  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!activityId) {
      Alert.alert("Error", "Activity ID is missing.");
      return;
    }

    if (!rating || !comment.trim()) {
      Alert.alert("Error", "Please add rating and comment.");
      return;
    }

    try {
      await submitReview({
        activityId,
        rating,
        comment,
      });

      Alert.alert("Success", "Review added successfully.");
      router.back();
    } catch (error) {
      console.log("Review submit error:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.container}>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Ionicons
                name={star <= rating ? "star" : "star-outline"}
                size={40}
                color="#E7D27A"
                style={styles.star}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Write your review..."
          multiline
          value={comment}
          onChangeText={setComment}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  container: {
    padding: 20,
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  star: {
    marginHorizontal: 5,
  },
  input: {
    height: 140,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#173B4D",
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});