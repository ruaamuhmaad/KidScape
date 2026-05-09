import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getDb } from './config';

export const getFavorites = async (userId: string): Promise<string[]> => {
  const db = getDb();
  const docRef = doc(db, 'favorites', userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.activities || [];
  } else {
    // Document doesn't exist yet, so no favorites
    return [];
  }
};

export const addFavorite = async (userId: string, activityId: string): Promise<void> => {
  const db = getDb();
  const docRef = doc(db, 'favorites', userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    // Create the document if it doesn't exist
    await setDoc(docRef, { activities: [activityId] });
  } else {
    // Update the existing document
    await updateDoc(docRef, {
      activities: arrayUnion(activityId),
    });
  }
};

export const removeFavorite = async (userId: string, activityId: string): Promise<void> => {
  const db = getDb();
  const docRef = doc(db, 'favorites', userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await updateDoc(docRef, {
      activities: arrayRemove(activityId),
    });
  }
};
