import { doc, getDoc, getFirestore } from "firebase/firestore";

const ACTIVITY_COLLECTIONS = ["activities", "Activities", "AllActivities", "allActivities"];

export async function getActivityById(id: string) {
  const safeId = String(id).trim();
  console.log("Fetching activity with id:", safeId);
  const firestore = getFirestore();

  for (const collectionName of ACTIVITY_COLLECTIONS) {
    const docRef = doc(firestore, collectionName, safeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        firestoreId: docSnap.id,
        ...docSnap.data(),
      };
    }
  }

  return null;
}
