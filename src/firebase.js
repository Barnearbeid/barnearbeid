import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAmJF8s2YFb5d42sZGgOJ5HOP9XC5ZwYB8",
  authDomain: "barnearbeid-no.firebaseapp.com",
  projectId: "barnearbeid-no",
  storageBucket: "barnearbeid-no.firebasestorage.app",
  messagingSenderId: "468278023792",
  appId: "1:468278023792:web:3363f7db13e216a13f46b5",
  measurementId: "G-4H4LP4MNK6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 