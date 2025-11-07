import { useState, useRef, useEffect } from 'react';
import FormStep from './FormStep';

const PersonalInfoStep = ({ data, onChange, currentStep }) => {
  const [photoPreview, setPhotoPreview] = useState(data.photo || null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  // Compress image for photo
  const compressImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.9) => {
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

          // Calculate new dimensions maintaining aspect ratio
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

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onload = () => {
                  resolve(reader.result);
                };
                reader.onerror = reject;
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      try {
        const compressedPhoto = await compressImage(file, 400, 400, 0.9);
        setPhotoPreview(compressedPhoto);
        handleChange('photo', compressedPhoto);
      } catch (error) {
        console.error('Error processing photo:', error);
        alert('Error processing photo. Please try again.');
      }
    }
  };

  const startCamera = async (facingMode = 'user') => {
    try {
      // Stop existing stream if any
      stopCamera();
      
      // Request access to the camera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: facingMode, // 'user' for front, 'environment' for back
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      setIsCameraReady(false);
      
      // Wait for modal to render, then attach stream to video
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsCameraReady(true);
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check your camera permissions or use file upload instead.');
    }
  };

  const handleCapturePhoto = async () => {
    setShowCameraModal(true);
    setIsFrontCamera(true);
    await startCamera('user');
  };

  const switchCamera = async () => {
    const newFacingMode = isFrontCamera ? 'environment' : 'user';
    setIsFrontCamera(!isFrontCamera);
    await startCamera(newFacingMode);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraReady(false);
  };

  const capturePhotoFromCamera = () => {
    if (!videoRef.current || !isCameraReady) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    
    // If using front camera, flip the image horizontally when capturing
    // (so the saved photo is not mirrored, only the preview was)
    if (isFrontCamera) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    
    ctx.drawImage(video, 0, 0);
    
    // Convert to base64 and compress
    canvas.toBlob(
      async (blob) => {
        if (blob) {
          try {
            const compressedPhoto = await compressImage(
              new File([blob], 'photo.jpg', { type: 'image/jpeg' }),
              400,
              400,
              0.9
            );
            setPhotoPreview(compressedPhoto);
            handleChange('photo', compressedPhoto);
            stopCamera();
            setShowCameraModal(false);
          } catch (error) {
            console.error('Error processing captured photo:', error);
            alert('Error processing photo. Please try again.');
          }
        }
      },
      'image/jpeg',
      0.9
    );
  };

  const cancelCamera = () => {
    stopCamera();
    setShowCameraModal(false);
  };

  // Cleanup camera stream when component unmounts or modal closes
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const removePhoto = () => {
    setPhotoPreview(null);
    handleChange('photo', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <FormStep step={1} currentStep={currentStep} title="Personal Information">
      {/* Information Note */}
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-900">
              <strong>Note:</strong> If you provide an email address, a soft copy of your resume will be sent to it once it's processed.
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Email is optional. If not provided, please contact the administrator to receive your resume.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            value={data.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            required
            className="input-field"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="email"
            id="email"
            value={data.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            className="input-field"
            placeholder="john.doe@example.com"
          />
          <p className="mt-2 text-xs text-gray-500">
            A soft copy of your resume will be sent to this email address if provided
          </p>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={data.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="input-field"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
            Address <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <textarea
            id="address"
            value={data.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={3}
            className="input-field resize-none"
            placeholder="123 Main St, City, State, ZIP"
          />
        </div>

        {/* Photo Upload/Capture */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Profile Photo <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {photoPreview ? (
              <div className="relative inline-block">
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  aria-label="Remove photo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  📁 Upload Photo
                </button>
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  📷 Capture Photo
                </button>
              </div>
            )}
            
            {/* Camera Modal */}
            {showCameraModal && (
              <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 max-w-2xl w-full">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    Take Your Photo
                  </h3>
                  
                  <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${isFrontCamera ? 'scale-x-[-1]' : ''}`}
                      style={{ transform: isFrontCamera ? 'scaleX(-1)' : 'none' }}
                    />
                    {!isCameraReady && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                        <div className="text-center text-white">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                          <p>Loading camera...</p>
                        </div>
                      </div>
                    )}
                    {/* Camera Switch Button */}
                    {isCameraReady && (
                      <button
                        type="button"
                        onClick={switchCamera}
                        className="absolute top-4 right-4 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-all duration-200 backdrop-blur-sm"
                        title={isFrontCamera ? 'Switch to back camera' : 'Switch to front camera'}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <div className="flex gap-3 justify-center">
                    <button
                      type="button"
                      onClick={cancelCamera}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={capturePhotoFromCamera}
                      disabled={!isCameraReady}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Capture Photo
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Position yourself in the frame and click "Capture Photo" when ready
                  </p>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <p className="text-xs text-gray-500">
              Upload a professional photo or capture one using your camera (Required)
            </p>
          </div>
        </div>

        {/* Birthday */}
        <div>
          <label htmlFor="birthday" className="block text-sm font-semibold text-gray-700 mb-2">
            Birthday <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="date"
            id="birthday"
            value={data.birthday || ''}
            onChange={(e) => handleChange('birthday', e.target.value)}
            className="input-field"
          />
        </div>

        {/* Civil Status */}
        <div>
          <label htmlFor="civilStatus" className="block text-sm font-semibold text-gray-700 mb-2">
            Civil Status <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <select
            id="civilStatus"
            value={data.civilStatus || ''}
            onChange={(e) => handleChange('civilStatus', e.target.value)}
            className="input-field"
          >
            <option value="">Select civil status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
            <option value="Separated">Separated</option>
          </select>
        </div>

        {/* Citizenship */}
        <div>
          <label htmlFor="citizenship" className="block text-sm font-semibold text-gray-700 mb-2">
            Citizenship <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            id="citizenship"
            value={data.citizenship || ''}
            onChange={(e) => handleChange('citizenship', e.target.value)}
            className="input-field"
            placeholder="e.g., Filipino, American, etc."
          />
        </div>

        {/* Religion */}
        <div>
          <label htmlFor="religion" className="block text-sm font-semibold text-gray-700 mb-2">
            Religion <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            id="religion"
            value={data.religion || ''}
            onChange={(e) => handleChange('religion', e.target.value)}
            className="input-field"
            placeholder="e.g., Catholic, Christian, Muslim, etc."
          />
        </div>

        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn Profile <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="url"
            id="linkedin"
            value={data.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            className="input-field"
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
            Personal Website/Portfolio <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="url"
            id="website"
            value={data.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            className="input-field"
            placeholder="https://johndoe.com"
          />
        </div>
      </div>
    </FormStep>
  );
};

export default PersonalInfoStep;

