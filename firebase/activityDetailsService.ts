import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDb } from "./config";
import type { ActivityDetailsRecord } from "@/components/activity-details/types";

const ACTIVITY_COLLECTIONS = [
  "activities",
  "Activities",
  "AllActivities",
  "allActivities",
];

export async function getActivityById(
  id: string
): Promise<ActivityDetailsRecord | null> {
  const safeId = String(id).trim();
  const db = getDb();

  console.log("requested id =", safeId);

  for (const collectionName of ACTIVITY_COLLECTIONS) {
    const docRef = doc(db, collectionName, safeId);
    const docSnap = await getDoc(docRef);

    console.log(
      "checking collection =",
      collectionName,
      "exists =",
      docSnap.exists()
    );

    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        id: docSnap.id,
      } as ActivityDetailsRecord;
    }
  }

  return null;
}

export async function toggleFavorite(
  id: string,
  newValue: 0 | 1
): Promise<void> {
  const safeId = String(id).trim();
  const db = getDb();

  console.log("toggle favorite id =", safeId, "new value =", newValue);

  for (const collectionName of ACTIVITY_COLLECTIONS) {
    const docRef = doc(db, collectionName, safeId);
    const docSnap = await getDoc(docRef);

    console.log(
      "checking favorite collection =",
      collectionName,
      "exists =",
      docSnap.exists()
    );

    if (docSnap.exists()) {
      await updateDoc(docRef, { isFavorite: newValue });
      console.log("favorite updated in collection =", collectionName);
      return;
    }
  }

  throw new Error(`Activity not found with id: ${safeId}`);
}