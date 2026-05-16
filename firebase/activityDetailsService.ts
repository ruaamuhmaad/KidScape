import { doc, getDoc } from "firebase/firestore";
import { getDb } from "./config";
import type { ActivityDetailsRecord } from "@/components/activity-details/types";
import type { ActivitySource } from "./firestoreService";

const ACTIVITY_COLLECTIONS: Record<ActivitySource, string[]> = {
  guest: ["activities", "Activities"],
  child: ["AllActivities", "allActivities"],
};

export async function getActivityById(
  id: string,
  source: ActivitySource = "guest"
): Promise<ActivityDetailsRecord | null> {
  const safeId = String(id).trim();
  const db = getDb();

  console.log("requested id =", safeId);

  const candidates: Array<Record<string, unknown>> = [];

  for (const collectionName of ACTIVITY_COLLECTIONS[source]) {
    const docRef = doc(db, collectionName, safeId);
    const docSnap = await getDoc(docRef);

    console.log(`${collectionName} exists =`, docSnap.exists());

    if (docSnap.exists()) {
      candidates.push({
        id: docSnap.id,
        ...(docSnap.data() as Record<string, unknown>),
      });
    }
  }

  if (!candidates.length) {
    return null;
  }

  const richCandidate = candidates.find((data) =>
    Boolean(
      data.description ||
      data.details ||
      data.about ||
      data.schedule ||
      (Array.isArray(data.amenities) && data.amenities.length > 0)
    )
  );

  return (richCandidate ?? candidates[0]) as ActivityDetailsRecord;
}
