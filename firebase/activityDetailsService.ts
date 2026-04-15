import { doc, getDoc } from "firebase/firestore";
import { getDb } from "./config";

export async function getActivityById(id: string) {
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
  };
}