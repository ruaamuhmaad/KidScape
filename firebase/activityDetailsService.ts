import { doc, getDoc , updateDoc  } from "firebase/firestore";
import { getDb } from "./config";
import type { ActivityDetailsRecord } from "@/components/activity-details/types";

export async function getActivityById(
  id: string
): Promise<ActivityDetailsRecord | null> {
  const safeId = String(id).trim();
  const db = getDb();

  console.log("requested id =", safeId);

  const docRef = doc(db, "activities", safeId);
  const docSnap = await getDoc(docRef);

  console.log("exists =", docSnap.exists());

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as ActivityDetailsRecord;
}
export async function toggleFavorite(id: string, newValue: 0 | 1): Promise<void> {
  const db = getDb();
  const docRef = doc(db, "activities", String(id).trim());
  await updateDoc(docRef, { isFavorite: newValue });
}