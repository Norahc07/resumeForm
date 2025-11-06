import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, APP_ID } from './config';

/**
 * Get the submissions collection reference
 */
const getSubmissionsCollection = () => {
  return collection(db, `artifacts/${APP_ID}/public/data/submissions`);
};

/**
 * Get a submission document reference
 */
const getSubmissionDoc = (submissionId) => {
  return doc(db, `artifacts/${APP_ID}/public/data/submissions/${submissionId}`);
};

/**
 * Submit a new resume
 */
export const submitResume = async (resumeData) => {
  try {
    const submissionData = {
      ...resumeData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'pending'
    };
    
    const docRef = await addDoc(getSubmissionsCollection(), submissionData);
    return { success: true, submissionId: docRef.id };
  } catch (error) {
    console.error('Error submitting resume:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get a single submission
 */
export const getSubmission = async (submissionId) => {
  try {
    const docSnap = await getDoc(getSubmissionDoc(submissionId));
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Submission not found' };
    }
  } catch (error) {
    console.error('Error getting submission:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all submissions (for admin)
 */
export const getAllSubmissions = async () => {
  try {
    const q = query(getSubmissionsCollection(), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const submissions = [];
    querySnapshot.forEach((doc) => {
      submissions.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: submissions };
  } catch (error) {
    console.error('Error getting submissions:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Subscribe to real-time updates of all submissions
 */
export const subscribeToSubmissions = (callback) => {
  const q = query(getSubmissionsCollection(), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const submissions = [];
      snapshot.forEach((doc) => {
        submissions.push({ id: doc.id, ...doc.data() });
      });
      callback({ success: true, data: submissions });
    },
    (error) => {
      console.error('Error in submissions subscription:', error);
      callback({ success: false, error: error.message });
    }
  );
};

/**
 * Update a submission
 */
export const updateSubmission = async (submissionId, updates) => {
  try {
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    await updateDoc(getSubmissionDoc(submissionId), updateData);
    return { success: true };
  } catch (error) {
    console.error('Error updating submission:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a submission
 */
export const deleteSubmission = async (submissionId) => {
  try {
    await deleteDoc(getSubmissionDoc(submissionId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting submission:', error);
    return { success: false, error: error.message };
  }
};

