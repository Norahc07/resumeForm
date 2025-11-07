import { useState } from 'react';
import PersonalInfoStep from './PersonalInfoStep';
import ExperienceStep from './ExperienceStep';
import EducationStep from './EducationStep';
import SkillsStep from './SkillsStep';

const SubmissionSuccess = ({ formData, onEdit, onResubmit, isResubmitting }) => {
  const [editingSection, setEditingSection] = useState(null);
  const [editedData, setEditedData] = useState(formData);

  const handleEditSection = (section) => {
    setEditingSection(section);
  };

  const handleSaveSection = (section) => {
    setEditingSection(null);
    onEdit(editedData);
  };

  const handleCancelEdit = () => {
    setEditedData(formData);
    setEditingSection(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card p-8 sm:p-10">
        {/* Success Header */}
        <div className="text-center mb-10 animate-fadeIn">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
            Resume Submitted Successfully!
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Thank you for submitting your resume. Your information has been received.
          </p>
          {formData.email ? (
            <p className="text-sm text-gray-500">
              A soft copy of your resume will be sent to <strong>{formData.email}</strong> once it's processed.
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Note: No email address was provided. Please contact the administrator to receive your resume.
            </p>
          )}
        </div>

        {/* Review Section */}
        <div className="mb-8">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  <strong>Review Your Submission</strong>
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Please review your information below. You can edit any section if needed.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
              {editingSection !== 'personal' && (
                <button
                  onClick={() => handleEditSection('personal')}
                  className="px-4 py-2 text-sm font-semibold text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit</span>
                </button>
              )}
            </div>
            
            {/* Photo Display */}
            {formData.photo && (
              <div className="mb-4 flex justify-center">
                <img
                  src={formData.photo}
                  alt="Profile"
                  className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
                />
              </div>
            )}

            {editingSection === 'personal' ? (
              <div className="space-y-4">
                <PersonalInfoStep
                  data={editedData}
                  onChange={setEditedData}
                  currentStep={1}
                />
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveSection('personal')}
                    className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-base font-semibold text-gray-900">{formData.fullName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-base font-semibold text-gray-900">{formData.email || 'N/A'}</p>
                </div>
                {formData.phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-base text-gray-900">{formData.phone}</p>
                  </div>
                )}
                {formData.birthday && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Birthday</p>
                    <p className="text-base text-gray-900">{new Date(formData.birthday).toLocaleDateString()}</p>
                  </div>
                )}
                {formData.civilStatus && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Civil Status</p>
                    <p className="text-base text-gray-900">{formData.civilStatus}</p>
                  </div>
                )}
                {formData.citizenship && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Citizenship</p>
                    <p className="text-base text-gray-900">{formData.citizenship}</p>
                  </div>
                )}
                {formData.religion && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Religion</p>
                    <p className="text-base text-gray-900">{formData.religion}</p>
                  </div>
                )}
                {formData.address && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-base text-gray-900">{formData.address}</p>
                  </div>
                )}
                {formData.linkedin && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">LinkedIn</p>
                    <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {formData.linkedin}
                    </a>
                  </div>
                )}
                {formData.website && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Website</p>
                    <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {formData.website}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Work Experience Section */}
          {formData.experiences && formData.experiences.length > 0 && (
            <div className="mb-6 bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Work Experience</h3>
                {editingSection !== 'experience' && (
                  <button
                    onClick={() => handleEditSection('experience')}
                    className="px-4 py-2 text-sm font-semibold text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {editingSection === 'experience' ? (
                <div className="space-y-4">
                  <ExperienceStep
                    data={editedData}
                    onChange={setEditedData}
                    currentStep={2}
                  />
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveSection('experience')}
                      className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.experiences.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-5 bg-white rounded-r-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-gray-900 text-lg">{exp.jobTitle || 'N/A'}</h4>
                      <p className="text-gray-600 font-medium">{exp.company || 'N/A'}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : (formatDate(exp.endDate) || 'N/A')}
                      </p>
                      {exp.description && (
                        <p className="text-gray-700 mt-3 whitespace-pre-wrap">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Education Section */}
          {formData.educations && formData.educations.length > 0 && (
            <div className="mb-6 bg-gradient-to-br from-white to-green-50 rounded-xl p-6 border border-green-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Education</h3>
                {editingSection !== 'education' && (
                  <button
                    onClick={() => handleEditSection('education')}
                    className="px-4 py-2 text-sm font-semibold text-green-600 bg-white border-2 border-green-600 rounded-lg hover:bg-green-50 transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {editingSection === 'education' ? (
                <div className="space-y-4">
                  <EducationStep
                    data={editedData}
                    onChange={setEditedData}
                    currentStep={3}
                  />
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveSection('education')}
                      className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.educations.map((edu, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-5 bg-white rounded-r-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-gray-900 text-lg">{edu.degree || 'N/A'}</h4>
                      <p className="text-gray-600 font-medium">{edu.institution || 'N/A'}</p>
                      {(edu.startDate || edu.endDate) && (
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate) || 'Present'}
                        </p>
                      )}
                      {edu.gpa && (
                        <p className="text-sm text-gray-600 mt-2">GPA: {edu.gpa}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Skills & Summary Section */}
          <div className="mb-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Skills & Summary</h3>
              {editingSection !== 'skills' && (
                <button
                  onClick={() => handleEditSection('skills')}
                  className="px-4 py-2 text-sm font-semibold text-purple-600 bg-white border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit</span>
                </button>
              )}
            </div>

            {editingSection === 'skills' ? (
              <div className="space-y-4">
                <SkillsStep
                  data={editedData}
                  onChange={setEditedData}
                  currentStep={4}
                />
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveSection('skills')}
                    className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.skills && formData.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-3">Skills</p>
                    <div className="flex flex-wrap gap-3">
                      {formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-200 shadow-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {formData.summary && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Professional Summary</p>
                    <p className="text-gray-700 whitespace-pre-wrap bg-white p-4 rounded-lg border border-gray-200">
                      {formData.summary}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg font-semibold hover:from-gray-200 hover:to-gray-300 shadow-md hover:shadow-lg transition-all duration-200"
          >
            Submit Another Resume
          </button>
          <button
            onClick={onResubmit}
            disabled={isResubmitting}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isResubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Resubmitting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Resubmit with Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSuccess;

