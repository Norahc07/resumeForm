import FormStep from './FormStep';
import { useState } from 'react';

const SkillsStep = ({ data, onChange, currentStep }) => {
  const [skillInput, setSkillInput] = useState('');
  const skills = data.skills || [];

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      onChange({ ...data, skills: [...skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    onChange({ ...data, skills: skills.filter(s => s !== skillToRemove) });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <FormStep step={4} currentStep={currentStep} title="Skills">
      <div className="space-y-6">
        <div>
          <label htmlFor="skillInput" className="block text-sm font-semibold text-gray-700 mb-2">
            Add Skills <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              id="skillInput"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 input-field"
              placeholder="e.g., JavaScript, React, Node.js"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Add
            </button>
          </div>
        </div>

        {skills.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Your Skills <span className="text-blue-600">({skills.length})</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-blue-600 hover:text-red-600 focus:outline-none font-bold text-lg leading-none"
                    aria-label={`Remove ${skill}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <label htmlFor="summary" className="block text-sm font-semibold text-gray-700 mb-2">
            Professional Summary <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <textarea
            id="summary"
            value={data.summary || ''}
            onChange={(e) => onChange({ ...data, summary: e.target.value })}
            rows={5}
            className="input-field resize-none"
            placeholder="Write a brief summary of your professional background and key strengths..."
          />
        </div>
      </div>
    </FormStep>
  );
};

export default SkillsStep;

