import { 
  signInAnonymously, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, APP_ID } from './config';

/**
 * Sign in anonymously for resume submitters
 */
export const signInAnonymous = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Anonymous sign-in error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sign in with email and password for admin users
 */
export const signInAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Admin sign-in error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if current user is an admin
 */
export const checkAdminStatus = async (userId) => {
  try {
    const roleDoc = await getDoc(
      doc(db, `artifacts/${APP_ID}/users/${userId}/roles/admin_status`)
    );
    return roleDoc.exists() && roleDoc.data().isAdmin === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Auth state observer
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

