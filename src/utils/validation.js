/**
 * Validation utilities for form inputs
 */

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-+()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validateURL = (url) => {
  if (!url) return true; // Optional field
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validateResumeData = (data) => {
  const errors = [];

  // Personal info validation
  if (!validateRequired(data.fullName)) {
    errors.push('Full name is required');
  }
  if (!validateRequired(data.email)) {
    errors.push('Email is required');
  } else if (!validateEmail(data.email)) {
    errors.push('Invalid email format');
  }
  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Invalid phone number format');
  }
  if (data.linkedin && !validateURL(data.linkedin)) {
    errors.push('Invalid LinkedIn URL');
  }
  if (data.website && !validateURL(data.website)) {
    errors.push('Invalid website URL');
  }

  // Experience validation
  if (!data.experiences || data.experiences.length === 0) {
    errors.push('At least one work experience is required');
  } else {
    data.experiences.forEach((exp, index) => {
      if (!validateRequired(exp.jobTitle)) {
        errors.push(`Experience ${index + 1}: Job title is required`);
      }
      if (!validateRequired(exp.company)) {
        errors.push(`Experience ${index + 1}: Company is required`);
      }
      if (!validateRequired(exp.startDate)) {
        errors.push(`Experience ${index + 1}: Start date is required`);
      }
    });
  }

  // Education validation
  if (!data.educations || data.educations.length === 0) {
    errors.push('At least one education entry is required');
  } else {
    data.educations.forEach((edu, index) => {
      if (!validateRequired(edu.degree)) {
        errors.push(`Education ${index + 1}: Degree is required`);
      }
      if (!validateRequired(edu.institution)) {
        errors.push(`Education ${index + 1}: Institution is required`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

