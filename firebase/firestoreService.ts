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
  city: string;
  gender: string;
  dateOfBirth: string;
  interests?: string[];
  parentId: string;
  imageUrl?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
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
export type ChildRecord = ChildData & { id: string };

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

const asString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value);
};

const asNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const asStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
};

const mapChild = (id: string, data: Record<string, unknown>): ChildRecord => ({
  id,
  name: asString(data.name),
  age: asNumber(data.age),
  city: asString(data.city),
  gender: asString(data.gender),
  dateOfBirth: asString(data.dateOfBirth),
  interests: asStringArray(data.interests),
  parentId: asString(data.parentId),
  imageUrl: asString(data.imageUrl),
  createdAt: data.createdAt instanceof Timestamp ? data.createdAt : undefined,
  updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : undefined,
});

export const addChildToFirebase = async (childData: ChildData) => {
  const db = getDb();
  const docRef = await addDoc(collection(db, 'children'), {
    ...childData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
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
  await updateDoc(childRef, {
    ...childData,
    updatedAt: Timestamp.now(),
  });
};

export const deleteChildFromFirebase = async (childId: string) => {
  const db = getDb();
  await deleteDoc(doc(db, 'children', childId));
};

export const getChildrenByParentId = async (parentId: string): Promise<ChildRecord[]> => {
  const db = getDb();
  const childrenQuery = query(collection(db, 'children'), where('parentId', '==', parentId));
  const querySnapshot = await getDocs(childrenQuery);

  return querySnapshot.docs
    .map((item) => mapChild(item.id, item.data() as Record<string, unknown>))
    .sort((first, second) => first.name.localeCompare(second.name));
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
