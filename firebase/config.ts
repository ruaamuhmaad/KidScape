import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAELadlP3Bh5cT6qET8qG8q7_QW6q3DCQc',
  authDomain: 'kidscape-6ac7b.firebaseapp.com',
  projectId: 'kidscape-6ac7b',
  storageBucket: 'kidscape-6ac7b.firebasestorage.app',
  messagingSenderId: '270750415295',
  appId: '1:270750415295:web:35079669f127a357b8c90a',
  measurementId: 'G-38KV7462H4',
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
