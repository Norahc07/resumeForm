import { updateSubmission } from './firestore';

/**
 * Upload resume image and send via email to user
 * Uses Vercel Serverless Function instead of Firebase Cloud Functions
 */
export const uploadResumeImageAndEmail = async (submissionId, imageBase64, fileName, fileType, userEmail, userName) => {
  try {
    // Get the API endpoint - use current origin (works for both production and preview deployments)
    const apiUrl = import.meta.env.VITE_API_URL || window.location.origin;
    
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
      let errorMessage = 'Unknown error';
      
      // Handle specific error codes
      if (response.status === 413) {
        errorMessage = 'File is too large. The image has been compressed, but it\'s still too big. Please use a smaller file (under 3MB) or compress it manually.';
      } else if (response.status === 404) {
        errorMessage = 'API endpoint not found. Please check if the function is deployed to Vercel.';
      } else if (response.status === 500) {
        // Try to get detailed error message from server
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || 'Server error occurred. Please check email configuration in Vercel.';
        } catch (parseError) {
          errorMessage = `Server error (${response.status}). Please check Vercel logs and email configuration.`;
        }
      } else {
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || `HTTP error! status: ${response.status}`;
        } catch {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
      }
      
      throw new Error(errorMessage);
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

