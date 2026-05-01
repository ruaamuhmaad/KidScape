import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  type Auth,
  type Persistence,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { Platform } from 'react-native';

declare const require: (moduleName: string) => unknown;

const firebaseConfig = {
  apiKey: 'AIzaSyAELadlP3Bh5cT6qET8cG8q7_QW6q3DCQc',
  authDomain: 'kidscape-6ac7b.firebaseapp.com',
  projectId: 'kidscape-6ac7b',
  storageBucket: 'kidscape-6ac7b.firebasestorage.app',
  messagingSenderId: '270750415295',
  appId: '1:270750415295:web:35079669f127a357b8c90a',
  measurementId: 'G-38KV7462H4',
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

const getNativeAuthPersistence = (): Persistence => {
  const authModule = require('firebase/auth') as {
    getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
  };

  return authModule.getReactNativePersistence(AsyncStorage);
};

export const getFirebaseApp = (): FirebaseApp => {
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }

  return app;
};

export const getDb = (): Firestore => {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }

  if (!db) {
    throw new Error('Firestore failed to initialize.');
  }

  return db;
};

export const getFirebaseAuth = (): Auth => {
  if (!auth) {
    const firebaseApp = getFirebaseApp();

    if (Platform.OS === 'web') {
      auth = getAuth(firebaseApp);
    } else {
      try {
        auth = initializeAuth(firebaseApp, {
          persistence: getNativeAuthPersistence(),
        });
      } catch {
        auth = getAuth(firebaseApp);
      }
    }
  }

  return auth;
};

export default getFirebaseApp;
