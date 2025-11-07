import { useState } from 'react';
import PersonalInfoStep from './PersonalInfoStep';
import ExperienceStep from './ExperienceStep';
import EducationStep from './EducationStep';
import SkillsStep from './SkillsStep';
import SubmissionSuccess from './SubmissionSuccess';
import { useToast } from '../../context/ToastContext';
import { signInAnonymous } from '../../firebase/auth';
import { submitResume as submitToFirestore } from '../../firebase/firestore';

const ResumeForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    website: '',
    photo: '',
    birthday: '',
    civilStatus: '',
    citizenship: '',
    religion: '',
    experiences: [{}],
    educations: [{}],
    skills: [],
    summary: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const { showToast } = useToast();

  const totalSteps = 4;

  const validateStep = (step) => {
    switch (step) {
      case 1: {
        if (!formData.fullName) {
          showToast('Please fill in the required field (Full Name)', 'error');
          return false;
        }
        if (!formData.photo) {
          showToast('Please upload or capture a profile photo', 'error');
          return false;
        }
        // Validate email format only if email is provided
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          showToast('Please enter a valid email address', 'error');
          return false;
        }
        return true;
      }
      case 2: {
        const hasValidExperience = formData.experiences.some(
          exp => exp.jobTitle && exp.company && exp.startDate
        );
        if (!hasValidExperience) {
          showToast('Please add at least one work experience with required fields', 'error');
          return false;
        }
        return true;
      }
      case 3: {
        const hasValidEducation = formData.educations.some(
          edu => edu.degree && edu.institution
        );
        if (!hasValidEducation) {
          showToast('Please add at least one education entry with required fields', 'error');
          return false;
        }
        return true;
      }
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Sign in anonymously if not already authenticated
      const authResult = await signInAnonymous();
      if (!authResult.success) {
        showToast('Failed to authenticate. Please try again.', 'error');
        setIsSubmitting(false);
        return;
      }

      // Submit resume data
      const submitResult = await submitToFirestore(formData);
      if (submitResult.success) {
        showToast('Resume submitted successfully!', 'success');
        // Store submitted data and show success page
        setSubmittedData({ ...formData });
        setIsSubmitted(true);
      } else {
        showToast(`Submission failed: ${submitResult.error}`, 'error');
      }
    } catch (error) {
      showToast('An unexpected error occurred. Please try again.', 'error');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditData = (updatedData) => {
    setFormData(updatedData);
    setSubmittedData(updatedData);
  };

  const handleResubmit = async () => {
    setIsSubmitting(true);
    try {
      const authResult = await signInAnonymous();
      if (!authResult.success) {
        showToast('Failed to authenticate. Please try again.', 'error');
        setIsSubmitting(false);
        return;
      }

      const submitResult = await submitToFirestore(formData);
      if (submitResult.success) {
        showToast('Resume resubmitted successfully!', 'success');
        setSubmittedData({ ...formData });
      } else {
        showToast(`Resubmission failed: ${submitResult.error}`, 'error');
      }
    } catch (error) {
      showToast('An unexpected error occurred. Please try again.', 'error');
      console.error('Resubmit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success page if submitted
  if (isSubmitted && submittedData) {
    return (
      <SubmissionSuccess
        formData={submittedData}
        onEdit={handleEditData}
        onResubmit={handleResubmit}
        isResubmitting={isSubmitting}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card p-8 sm:p-10">
        {/* Progress indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form steps */}
        <PersonalInfoStep
          data={formData}
          onChange={setFormData}
          currentStep={currentStep}
        />
        <ExperienceStep
          data={formData}
          onChange={setFormData}
          currentStep={currentStep}
        />
        <EducationStep
          data={formData}
          onChange={setFormData}
          currentStep={currentStep}
        />
        <SkillsStep
          data={formData}
          onChange={setFormData}
          currentStep={currentStep}
        />

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-10 pt-8 border-t border-gray-200">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
          >
            ← Previous
          </button>
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white 
                         rounded-lg font-semibold shadow-lg hover:shadow-xl
                         transform hover:scale-105 active:scale-100
                         transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-300
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                '✓ Submit Resume'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;

