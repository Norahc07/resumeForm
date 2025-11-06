// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDlZeKBV176Ixb2Wicbj_wr-ugzpqQrBsA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "resumeform-48ff7.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "resumeform-48ff7",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "resumeform-48ff7.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "424694821473",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:424694821473:web:34565d19296b476c877020",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-12XHJDF4RE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };

// Enable offline persistence for Firestore
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support all of the features required for persistence');
  }
});

// Get the app ID from environment or use default
export const APP_ID = import.meta.env.VITE_APP_ID || 'resume-builder';

export default app;

