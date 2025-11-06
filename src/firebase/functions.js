import { httpsCallable, getFunctions } from 'firebase/functions';
import app from './config';

const functions = getFunctions(app);

/**
 * Upload resume image and send via email to user
 */
export const uploadResumeImageAndEmail = async (submissionId, imageBase64, fileName, fileType) => {
  try {
    const uploadAndEmail = httpsCallable(functions, 'uploadResumeImageAndEmail');
    const result = await uploadAndEmail({ 
      submissionId, 
      imageBase64, 
      fileName, 
      fileType 
    });
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error uploading resume image:', error);
    return { success: false, error: error.message };
  }
};

