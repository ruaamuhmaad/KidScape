import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { getDb } from "./config";
import { sendNotification } from "./notificationService";

type ReviewData = {
  activityId: string;
  rating: number;
  comment: string;
};

export async function submitReview(userId: string, data: ReviewData) {
  const db = getDb();
  const ACTIVITY_COLLECTIONS = ["activities", "Activities", "AllActivities", "allActivities"];
  let activityRef = null;

  for (const collectionName of ACTIVITY_COLLECTIONS) {
    const docRef = doc(db, collectionName, data.activityId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      activityRef = docRef;
      break;
    }
  }

  if (!activityRef) {
    throw new Error("Activity not found");
  }

  await updateDoc(activityRef, {
    reviews: arrayUnion({
      rating: data.rating,
      comment: data.comment,
    }),
  });

  await sendNotification(
    userId,
    "Review Added",
    "Thank you for your new review",
    "review_added"
  );
}