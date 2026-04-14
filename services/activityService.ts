import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function getActivityById(id: string) {
  const safeId = String(id).trim();
  console.log("Fetching activity with id:", safeId);

  const docRef = doc(db, "activities", safeId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    firestoreId: docSnap.id,
    ...docSnap.data(),
  };
}