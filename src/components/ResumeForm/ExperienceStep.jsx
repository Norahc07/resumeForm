import FormStep from './FormStep';

const ExperienceStep = ({ data, onChange, currentStep }) => {
  const experiences = data.experiences || [{}];

  const handleChange = (index, field, value) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, experiences: updated });
  };

  const addExperience = () => {
    onChange({ ...data, experiences: [...experiences, {}] });
  };

  const removeExperience = (index) => {
    const updated = experiences.filter((_, i) => i !== index);
    onChange({ ...data, experiences: updated });
  };

  return (
    <FormStep step={2} currentStep={currentStep} title="Work Experience">
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Experience {index + 1}</h3>
              {experiences.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={exp.jobTitle || ''}
                  onChange={(e) => handleChange(index, 'jobTitle', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <input
                  type="text"
                  value={exp.company || ''}
                  onChange={(e) => handleChange(index, 'company', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tech Company Inc."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="month"
                    value={exp.startDate || ''}
                    onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={exp.endDate || ''}
                    onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <label className="mt-2 flex items-center">
                    <input
                      type="checkbox"
                      checked={exp.current || false}
                      onChange={(e) => handleChange(index, 'current', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Currently working here</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={exp.description || ''}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your responsibilities and achievements..."
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addExperience}
          className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          + Add Another Experience
        </button>
      </div>
    </FormStep>
  );
};

export default ExperienceStep;

