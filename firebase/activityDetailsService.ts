import { doc, getDoc , updateDoc  } from "firebase/firestore";
import { getDb } from "./config";
import type { ActivityDetailsRecord } from "@/components/activity-details/types";

const ACTIVITY_COLLECTIONS = ["activities", "Activities", "AllActivities", "allActivities"];

export async function getActivityById(
  id: string
): Promise<ActivityDetailsRecord | null> {
  const safeId = String(id).trim();
  const db = getDb();

  console.log("requested id =", safeId);

  for (const collectionName of ACTIVITY_COLLECTIONS) {
    const docRef = doc(db, collectionName, safeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as ActivityDetailsRecord;
    }
  }

  return null;
}
export async function toggleFavorite(id: string, newValue: 0 | 1): Promise<void> {
  const db = getDb();
  const docRef = doc(db, "activities", String(id).trim());
  await updateDoc(docRef, { isFavorite: newValue });
}