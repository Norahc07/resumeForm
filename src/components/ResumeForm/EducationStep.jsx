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
          <div key={index} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Education {index + 1}</h3>
              {educations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Degree/Certificate *
                </label>
                <input
                  type="text"
                  value={edu.degree || ''}
                  onChange={(e) => handleChange(index, 'degree', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institution *
                </label>
                <input
                  type="text"
                  value={edu.institution || ''}
                  onChange={(e) => handleChange(index, 'institution', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="University Name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={edu.startDate || ''}
                    onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date / Graduation Date
                  </label>
                  <input
                    type="month"
                    value={edu.endDate || ''}
                    onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GPA (Optional)
                </label>
                <input
                  type="text"
                  value={edu.gpa || ''}
                  onChange={(e) => handleChange(index, 'gpa', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="3.8/4.0"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addEducation}
          className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          + Add Another Education
        </button>
      </div>
    </FormStep>
  );
};

export default EducationStep;

