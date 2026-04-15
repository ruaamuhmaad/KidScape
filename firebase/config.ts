import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

const getRequiredEnv = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const firebaseConfig = {
  apiKey: getRequiredEnv('EXPO_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getRequiredEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getRequiredEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getRequiredEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getRequiredEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getRequiredEnv('EXPO_PUBLIC_FIREBASE_APP_ID'),
  measurementId: getRequiredEnv('EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID'),
};

let app: FirebaseApp | undefined;
export let db: Firestore | undefined;

const initFirebase = () => {
  if (typeof window === 'undefined') {
    throw new Error('Firebase can only be initialized on the client side.');
  }

  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
};

export const getDb = (): Firestore => {
  if (!db) {
    initFirebase();
  }

  if (!db) {
    throw new Error('Firestore failed to initialize.');
  }

  return db;
};

export default getDb;
