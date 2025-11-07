import { useState, useRef } from 'react';
import { uploadResumeImageAndEmail } from '../../firebase/functions';
import { useToast } from '../../context/ToastContext';
import Modal from '../Modal';

const UploadResumeModal = ({ isOpen, onClose, submission, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  if (!submission) return null;

  // Compress image to reduce file size (returns File object)
  const compressImage = (file, maxWidth = 1920, maxHeight = 2560, quality = 0.8, targetSizeMB = 2.5) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Recursive compression function
          const compressWithQuality = (currentQuality) => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Failed to compress image'));
                  return;
                }

                const targetSize = targetSizeMB * 1024 * 1024;
                
                if (blob.size <= targetSize || currentQuality <= 0.3) {
                  // Convert blob to File
                  const compressedFile = new File([blob], file.name, {
                    type: file.type || 'image/jpeg',
                    lastModified: Date.now()
                  });
                  resolve(compressedFile);
                } else {
                  // Reduce quality and try again
                  compressWithQuality(currentQuality * 0.8);
                }
              },
              file.type || 'image/jpeg',
              currentQuality
            );
          };

          compressWithQuality(quality);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type - accept both images and PDFs
      const isImage = file.type.startsWith('image/');
      const isPDF = file.type === 'application/pdf';
      
      if (!isImage && !isPDF) {
        showToast('Please select an image file (PNG, JPG, etc.) or a PDF file', 'error');
        return;
      }

      // Validate file size (max 10MB before compression/processing)
      if (file.size > 10 * 1024 * 1024) {
        showToast('File size must be less than 10MB. Please use a smaller file.', 'error');
        return;
      }

      try {
        let processedFile = file;
        
        // Only compress images, not PDFs
        if (isImage) {
          // Show compression message for large image files
          if (file.size > 2 * 1024 * 1024) {
            showToast('Compressing image for optimal upload...', 'info');
          }
          
          // Compress image if it's large (compress if > 1MB)
          if (file.size > 1 * 1024 * 1024) {
            processedFile = await compressImage(file, 1920, 2560, 0.85, 2.5);
            if (processedFile.size < file.size) {
              showToast(`Image compressed from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`, 'success');
            }
          }
        } else if (isPDF) {
          // For PDFs, just validate size
          if (file.size > 5 * 1024 * 1024) {
            showToast('PDF file is large. Maximum recommended size is 5MB.', 'warning');
          }
        }

        setSelectedFile(processedFile);

        // Create preview (for images) or show PDF icon
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(processedFile);
      } catch (error) {
        console.error('Error processing file:', error);
        showToast('Error processing file. Please try another file.', 'error');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast('Please select a file (image or PDF) to upload', 'error');
      return;
    }

    if (!submission.email) {
      showToast('Submission email is missing. Please add an email address to the submission before uploading the resume.', 'error');
      return;
    }

    setIsUploading(true);

    try {
      // Vercel has 4.5MB request body limit, we'll target 2.5MB to be safe (base64 adds ~33% overhead)
      const maxSize = 2.5 * 1024 * 1024; // 2.5MB
      
      // Check file size and compress further if needed (only for images)
      const isImage = selectedFile.type.startsWith('image/');
      const isPDF = selectedFile.type === 'application/pdf';
      let fileToUpload = selectedFile;
      
      if (isImage && selectedFile.size > maxSize) {
        showToast('Compressing image further to meet size requirements...', 'info');
        
        try {
          // More aggressive compression
          fileToUpload = await compressImage(selectedFile, 1600, 2000, 0.7, 2.0);
          
          if (fileToUpload.size > maxSize) {
            // Even more aggressive
            fileToUpload = await compressImage(selectedFile, 1200, 1600, 0.6, 1.8);
          }
          
          if (fileToUpload.size > maxSize) {
            showToast('Image is still too large. Please use a smaller file (under 2MB recommended).', 'error');
            setIsUploading(false);
            return;
          }
          
          showToast(`Final size: ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB - Ready to upload`, 'success');
        } catch (compressionError) {
          console.error('Compression error:', compressionError);
          showToast('Unable to compress image further. Please use a smaller file.', 'error');
          setIsUploading(false);
          return;
        }
      } else if (isPDF && selectedFile.size > maxSize) {
        // For PDFs, just warn if too large
        if (selectedFile.size > 3.5 * 1024 * 1024) {
          showToast('PDF file is too large. Maximum size is 3.5MB. Please compress the PDF or use a smaller file.', 'error');
          setIsUploading(false);
          return;
        }
      }

      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(fileToUpload);
      
      reader.onload = async () => {
        try {
          const base64Image = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix
          
          // Check base64 size (base64 is ~33% larger than binary)
          const base64Size = (base64Image.length * 3) / 4;
          const maxBase64Size = 3.5 * 1024 * 1024; // 3.5MB for base64 (slightly under 4.5MB Vercel limit)
          
          if (base64Size > maxBase64Size) {
            showToast('Image is too large even after compression. Please use a file under 2MB.', 'error');
            setIsUploading(false);
            return;
          }
          
          const result = await uploadResumeImageAndEmail(
            submission.id,
            base64Image,
            fileToUpload.name,
            fileToUpload.type,
            submission.email,
            submission.fullName
          );

          setIsUploading(false);

          if (result.success) {
            showToast('Resume image uploaded and sent successfully!', 'success');
            onSuccess();
            handleClose();
          } else {
            // Handle specific error messages
            let errorMsg = result.error;
            
            // Extract error message properly (handle both string and object)
            if (typeof errorMsg === 'object') {
              errorMsg = errorMsg.message || errorMsg.error || JSON.stringify(errorMsg);
            }
            
            if (errorMsg && errorMsg.includes('too large')) {
              showToast('File is too large. Please compress the image or use a smaller file (under 2MB).', 'error');
            } else if (errorMsg && errorMsg.includes('email') && errorMsg.includes('configuration')) {
              showToast('Email service not configured. Please check Vercel environment variables (EMAIL_USER, EMAIL_PASSWORD).', 'error');
            } else {
              showToast(`Failed to send: ${errorMsg || 'Unknown error'}`, 'error');
            }
          }
        } catch (error) {
          setIsUploading(false);
          
          // Properly extract error message
          let errorMessage = 'Unknown error occurred';
          if (error && typeof error === 'object') {
            errorMessage = error.message || error.error || error.toString();
          } else if (error) {
            errorMessage = String(error);
          }
          
          // Handle specific error types
          if (errorMessage.includes('413') || errorMessage.includes('too large') || errorMessage.includes('Content Too Large')) {
            showToast('File is too large for upload. Please compress the image or use a smaller file (under 2MB recommended).', 'error');
          } else if (errorMessage.includes('email') && (errorMessage.includes('configuration') || errorMessage.includes('authentication') || errorMessage.includes('App Password'))) {
            // Show detailed error message for email authentication issues
            const detailedMsg = errorMessage.includes('App Password') 
              ? errorMessage 
              : 'Email service error. Please check Vercel environment variables (EMAIL_USER, EMAIL_PASSWORD). For Gmail, you must use an App Password, not your regular password.';
            showToast(detailedMsg, 'error');
          } else {
            showToast(`Upload failed: ${errorMessage}`, 'error');
          }
          console.error('Upload error:', error);
        }
      };

      reader.onerror = () => {
        setIsUploading(false);
        showToast('Error reading file. Please try again.', 'error');
      };
    } catch (error) {
      setIsUploading(false);
      showToast(`Upload failed: ${error.message}`, 'error');
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload Resume Image"
      size="lg"
    >
      <div className="space-y-6">
        {/* User Info */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-sm font-medium text-blue-900">
            <strong>Recipient:</strong> {submission.email}
          </p>
          <p className="text-xs text-blue-700 mt-1">
            The resume image will be sent to this email address
          </p>
        </div>

        {/* File Upload Area */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Resume File (Image or PDF) <span className="text-red-500">*</span>
          </label>
          
          {!preview && !selectedFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-200"
            >
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF, PDF (images automatically compressed)
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Recommended: Under 2MB for images, 3.5MB for PDFs
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedFile?.type === 'application/pdf' ? (
                // PDF Preview
                <div className="relative border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 p-8">
                  <div className="text-center">
                    <svg className="mx-auto h-16 w-16 text-red-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-semibold text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
                    aria-label="Remove file"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                // Image Preview
                <div className="relative border-2 border-gray-200 rounded-xl overflow-hidden">
                  <img
                    src={preview}
                    alt="Resume preview"
                    className="w-full h-auto max-h-96 object-contain bg-gray-50"
                  />
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
                    aria-label="Remove image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <div className="text-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Change File
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* File Info */}
        {selectedFile && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  {selectedFile.size > 2.5 * 1024 * 1024 && (
                    <span className="ml-2 text-yellow-600 font-semibold">(Will be compressed further)</span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Type: {selectedFile.type === 'application/pdf' ? 'PDF' : selectedFile.type}</p>
                <p className={`text-xs mt-1 font-semibold ${
                  selectedFile.size <= 2.5 * 1024 * 1024 
                    ? 'text-green-600' 
                    : selectedFile.size <= 3.5 * 1024 * 1024
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {selectedFile.size <= 2.5 * 1024 * 1024 
                    ? '✓ Ready to upload' 
                    : selectedFile.size <= 3.5 * 1024 * 1024
                    ? selectedFile.type === 'application/pdf' ? '⚠ Large PDF' : '⚠ Will compress'
                    : '⚠ Too large'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading & Sending...
              </span>
            ) : (
              '✓ Upload & Send Email'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UploadResumeModal;

