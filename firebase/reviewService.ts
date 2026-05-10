import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getDb } from "./config";

type ReviewData = {
  activityId: string;
  rating: number;
  comment: string;
};

export async function submitReview(data: ReviewData) {
  const db = getDb();

  const activityRef = doc(db, "activities", data.activityId);

  await updateDoc(activityRef, {
    reviews: arrayUnion({
      rating: data.rating,
      comment: data.comment,
    }),
  });
}