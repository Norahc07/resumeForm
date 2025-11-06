import FormStep from './FormStep';

const PersonalInfoStep = ({ data, onChange, currentStep }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <FormStep step={1} currentStep={currentStep} title="Personal Information">
      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            value={data.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={data.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="john.doe@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={data.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            id="address"
            value={data.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="123 Main St, City, State, ZIP"
          />
        </div>

        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn Profile
          </label>
          <input
            type="url"
            id="linkedin"
            value={data.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
            Personal Website/Portfolio
          </label>
          <input
            type="url"
            id="website"
            value={data.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://johndoe.com"
          />
        </div>
      </div>
    </FormStep>
  );
};

export default PersonalInfoStep;

