import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { getDb } from './config';

export interface ChildData {
  name: string;
  age: number;
  interests?: string[];
  parentId: string;
  createdAt?: Timestamp;
}

export interface ActivityData {
  title: string;
  location: string;
  rating: number;
  imageUrl: string;
  description?: string;
  createdAt?: Timestamp;
}

export interface ClubData {
  title: string;
  details: string;
  rating: number;
  imageUrl: string;
  description?: string;
  location?: string;
  createdAt?: Timestamp;
}

type FirebaseEntity = Record<string, unknown> & { id: string };

const capitalizeName = (name: string) => name[0].toUpperCase() + name.slice(1);

const tryCollections = async (baseName: string) => {
  const db = getDb();
  const names = [baseName, capitalizeName(baseName)];

  for (const name of names) {
    const snapshot = await getDocs(collection(db, name));
    if (!snapshot.empty) {
      return snapshot;
    }
  }

  return getDocs(collection(db, baseName));
};

const tryDocFromCollections = async (baseName: string, id: string) => {
  const db = getDb();
  const names = [baseName, capitalizeName(baseName)];

  for (const name of names) {
    const docSnapshot = await getDoc(doc(db, name, id));
    if (docSnapshot.exists()) {
      return docSnapshot;
    }
  }

  return null;
};

const mapEntity = (entityId: string, data: Record<string, unknown>): FirebaseEntity => ({
  id: entityId,
  ...data,
});

export const addChildToFirebase = async (childData: ChildData) => {
  const db = getDb();
  const docRef = await addDoc(collection(db, 'children'), {
    ...childData,
    createdAt: Timestamp.now(),
  });

  return docRef.id;
};

export const addActivityToFirebase = async (activityData: ActivityData) => {
  const db = getDb();
  const docRef = await addDoc(collection(db, 'activities'), {
    ...activityData,
    createdAt: Timestamp.now(),
  });

  return docRef.id;
};

export const addClubToFirebase = async (clubData: ClubData) => {
  const db = getDb();
  const docRef = await addDoc(collection(db, 'clubs'), {
    ...clubData,
    createdAt: Timestamp.now(),
  });

  return docRef.id;
};

export const updateChildInFirebase = async (childId: string, childData: Partial<ChildData>) => {
  const db = getDb();
  const childRef = doc(db, 'children', childId);
  await updateDoc(childRef, childData);
};

export const deleteChildFromFirebase = async (childId: string) => {
  const db = getDb();
  await deleteDoc(doc(db, 'children', childId));
};

export const getChildrenByParentId = async (parentId: string): Promise<FirebaseEntity[]> => {
  const db = getDb();
  const childrenQuery = query(collection(db, 'children'), where('parentId', '==', parentId));
  const querySnapshot = await getDocs(childrenQuery);

  return querySnapshot.docs.map((item) => mapEntity(item.id, item.data() as Record<string, unknown>));
};

export const getActivityFromFirebase = async (activityId: string): Promise<FirebaseEntity | null> => {
  const docSnapshot = await tryDocFromCollections('activities', activityId);

  if (!docSnapshot) {
    return null;
  }

  return mapEntity(docSnapshot.id, docSnapshot.data() as Record<string, unknown>);
};

export const getClubFromFirebase = async (clubId: string): Promise<FirebaseEntity | null> => {
  const docSnapshot = await tryDocFromCollections('clubs', clubId);

  if (!docSnapshot) {
    return null;
  }

  return mapEntity(docSnapshot.id, docSnapshot.data() as Record<string, unknown>);
};

export const getAllActivitiesFromFirebase = async (): Promise<FirebaseEntity[]> => {
  const querySnapshot = await tryCollections('activities');

  return querySnapshot.docs.map((item) => mapEntity(item.id, item.data() as Record<string, unknown>));
};

export const getAllClubsFromFirebase = async (): Promise<FirebaseEntity[]> => {
  const querySnapshot = await tryCollections('clubs');

  return querySnapshot.docs.map((item) => mapEntity(item.id, item.data() as Record<string, unknown>));
};

const extractInterests = (data: Record<string, unknown>): string[] | null => {
  if (Array.isArray(data.interests)) {
    return data.interests.filter((item): item is string => typeof item === 'string');
  }

  if (Array.isArray(data.Data)) {
    return data.Data.filter((item): item is string => typeof item === 'string');
  }

  if (Array.isArray(data.data)) {
    return data.data.filter((item): item is string => typeof item === 'string');
  }

  return null;
};

const getInterestsFromCommonDataDoc = async () => {
  const db = getDb();
  const docRef = doc(db, 'CommonData', 'interests');
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return extractInterests(docSnap.data() as Record<string, unknown>);
};

const getInterestsFromInterestsCollection = async () => {
  const querySnapshot = await tryCollections('interests');

  if (querySnapshot.empty) {
    return [];
  }

  const docData = querySnapshot.docs[0].data() as Record<string, unknown>;
  return extractInterests(docData) ?? [];
};

export const getInterestsFromFirebase = async (): Promise<string[]> => {
  const commonInterests = await getInterestsFromCommonDataDoc();

  if (Array.isArray(commonInterests)) {
    return commonInterests;
  }

  return getInterestsFromInterestsCollection();
};
