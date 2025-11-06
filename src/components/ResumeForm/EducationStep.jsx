import FormStep from './FormStep';

const EducationStep = ({ data, onChange, currentStep }) => {
  const educations = data.educations || [{}];

  const handleChange = (index, field, value) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, educations: updated });
  };

  const addEducation = () => {
    onChange({ ...data, educations: [...educations, {}] });
  };

  const removeEducation = (index) => {
    const updated = educations.filter((_, i) => i !== index);
    onChange({ ...data, educations: updated });
  };

  return (
    <FormStep step={3} currentStep={currentStep} title="Education">
      <div className="space-y-6">
        {educations.map((edu, index) => (
          <div key={index} className="p-6 border-2 border-gray-200 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-800">Education {index + 1}</h3>
              {educations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="px-3 py-1 text-red-600 hover:text-white hover:bg-red-600 text-sm font-medium rounded-lg transition-all duration-200"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Degree/Certificate <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={edu.degree || ''}
                  onChange={(e) => handleChange(index, 'degree', e.target.value)}
                  required
                  className="input-field"
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Institution <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={edu.institution || ''}
                  onChange={(e) => handleChange(index, 'institution', e.target.value)}
                  required
                  className="input-field"
                  placeholder="University Name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="month"
                    value={edu.startDate || ''}
                    onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date / Graduation Date <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="month"
                    value={edu.endDate || ''}
                    onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  GPA <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={edu.gpa || ''}
                  onChange={(e) => handleChange(index, 'gpa', e.target.value)}
                  className="input-field"
                  placeholder="3.8/4.0"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addEducation}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg font-semibold hover:from-gray-200 hover:to-gray-300 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300"
        >
          + Add Another Education
        </button>
      </div>
    </FormStep>
  );
};

export default EducationStep;

