import { httpsCallable, getFunctions } from 'firebase/functions';
import app from './config';

const functions = getFunctions(app);

/**
 * Trigger resume-to-image conversion and email delivery
 */
export const convertResumeToImageAndEmail = async (submissionId, recipientEmail) => {
  try {
    const convertAndEmail = httpsCallable(functions, 'convertResumeToImageAndEmail');
    const result = await convertAndEmail({ submissionId, recipientEmail });
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error converting resume to image:', error);
    return { success: false, error: error.message };
  }
};

