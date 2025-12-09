// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrU6jgTN86jzsH7oUOVicR9J9BNJ-HKCM",
  authDomain: "aura101-b5ac9.firebaseapp.com",
  projectId: "aura101-b5ac9",
  storageBucket: "aura101-b5ac9.firebasestorage.app",
  messagingSenderId: "391592449236",
  appId: "1:391592449236:web:b7487ee7122cc6a6175741",
  measurementId: "G-T9LQKH7ZF0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const appId = 'aura-tracker';
