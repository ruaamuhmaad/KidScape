import { doc, getDoc, getFirestore } from "firebase/firestore";
import db from "./config";

export async function getActivityById(id: string) {
  const safeId = String(id).trim();
  console.log("Fetching activity with id:", safeId);
const firestore = getFirestore(); 

const docRef = doc(firestore, "activities", safeId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    firestoreId: docSnap.id,
    ...docSnap.data(),
  };
}