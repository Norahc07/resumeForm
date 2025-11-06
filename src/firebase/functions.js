import { updateSubmission } from './firestore';

/**
 * Upload resume image and send via email to user
 * Uses Vercel Serverless Function instead of Firebase Cloud Functions
 */
export const uploadResumeImageAndEmail = async (submissionId, imageBase64, fileName, fileType, userEmail, userName) => {
  try {
    // Get the API endpoint - use environment variable or default to Vercel deployment
    const apiUrl = import.meta.env.VITE_API_URL || 'https://resume-form-eight.vercel.app';
    
    const response = await fetch(`${apiUrl}/api/upload-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors', // Explicitly enable CORS
      body: JSON.stringify({
        submissionId,
        imageBase64,
        fileName,
        fileType,
        userEmail,
        userName,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Update Firestore status to 'completed' after successful email
    if (result.success) {
      await updateSubmission(submissionId, {
        status: 'completed',
        completedAt: new Date(),
        resumeSentAt: new Date(),
      });
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Error uploading resume image:', error);
    return { success: false, error: error.message };
  }
};

