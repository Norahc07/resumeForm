import { useState } from 'react';
import PersonalInfoStep from './PersonalInfoStep';
import ExperienceStep from './ExperienceStep';
import EducationStep from './EducationStep';
import SkillsStep from './SkillsStep';
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
    experiences: [{}],
    educations: [{}],
    skills: [],
    summary: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const totalSteps = 4;

  const validateStep = (step) => {
    switch (step) {
      case 1: {
        if (!formData.fullName || !formData.email) {
          showToast('Please fill in all required fields (Name and Email)', 'error');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          address: '',
          linkedin: '',
          website: '',
          experiences: [{}],
          educations: [{}],
          skills: [],
          summary: ''
        });
        setCurrentStep(1);
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Previous
          </button>
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Resume'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;

