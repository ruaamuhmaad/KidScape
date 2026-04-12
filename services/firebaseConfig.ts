import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZUurmEq2PEEXHzzcPAb9eLjpsvPMtcpU",
  authDomain: "kidscape-6ac7b.firebaseapp.com",
  projectId: "kidscape-6ac7b",
  storageBucket: "kidscape-6ac7b.firebasestorage.app",
  messagingSenderId: "270750415295",
  appId: "1:270750415295:android:6a9e1c2a746ecd63b8c90a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);