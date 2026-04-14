import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAELadlP3Bh5cT6qET8cG8q7_QW6q3DCQc",
  authDomain: "kidscape-6ac7b.firebaseapp.com",
  projectId: "kidscape-6ac7b",
  storageBucket: "kidscape-6ac7b.firebasestorage.app",
  messagingSenderId: "270750415295",
  appId: "1:270750415295:web:35079669f127a357b8c90a",
  measurementId: "G-38KV7462H4"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;