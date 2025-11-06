import FormStep from './FormStep';

const PersonalInfoStep = ({ data, onChange, currentStep }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
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
              <strong>Note:</strong> The email address you provide will be used to send you a soft copy of your resume once it's processed.
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Please ensure your email address is correct and active.
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
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={data.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            className="input-field"
            placeholder="john.doe@example.com"
          />
          <p className="mt-2 text-xs text-gray-500">
            A soft copy of your resume will be sent to this email address
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

