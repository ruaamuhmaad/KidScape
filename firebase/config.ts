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
   apiKey: "AIzaSyAELadlP3Bh5cT6qET8cG8q7_QW6q3DCQc",
     authDomain: "kidscape-6ac7b.firebaseapp.com",
     projectId: "kidscape-6ac7b",
     storageBucket: "kidscape-6ac7b.firebasestorage.app",
     messagingSenderId: "270750415295",
     appId: "1:270750415295:web:35079669f127a357b8c90a",
     measurementId: "G-38KV7462H4",
 /* apiKey: getRequiredEnv('EXPO_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getRequiredEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getRequiredEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getRequiredEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getRequiredEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getRequiredEnv('EXPO_PUBLIC_FIREBASE_APP_ID'),
  measurementId: getRequiredEnv('EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID'),*/
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

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
