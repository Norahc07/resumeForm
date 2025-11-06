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
          <div key={index} className="p-6 border-2 border-gray-200 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-800">Experience {index + 1}</h3>
              {experiences.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="px-3 py-1 text-red-600 hover:text-white hover:bg-red-600 text-sm font-medium rounded-lg transition-all duration-200"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={exp.jobTitle || ''}
                  onChange={(e) => handleChange(index, 'jobTitle', e.target.value)}
                  required
                  className="input-field"
                  placeholder="Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={exp.company || ''}
                  onChange={(e) => handleChange(index, 'company', e.target.value)}
                  required
                  className="input-field"
                  placeholder="Tech Company Inc."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="month"
                    value={exp.startDate || ''}
                    onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="month"
                    value={exp.endDate || ''}
                    onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                    className="input-field"
                    disabled={exp.current}
                  />
                  <label className="mt-3 flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exp.current || false}
                      onChange={(e) => handleChange(index, 'current', e.target.checked)}
                      className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Currently working here</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={exp.description || ''}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Describe your responsibilities and achievements..."
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addExperience}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg font-semibold hover:from-gray-200 hover:to-gray-300 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300"
        >
          + Add Another Experience
        </button>
      </div>
    </FormStep>
  );
};

export default ExperienceStep;

