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
      <div className="space-y-4">
        <div>
          <label htmlFor="skillInput" className="block text-sm font-medium text-gray-700 mb-1">
            Add Skills
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="skillInput"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., JavaScript, React, Node.js"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
        </div>

        {skills.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Skills ({skills.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                    aria-label={`Remove ${skill}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
            Professional Summary
          </label>
          <textarea
            id="summary"
            value={data.summary || ''}
            onChange={(e) => onChange({ ...data, summary: e.target.value })}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write a brief summary of your professional background and key strengths..."
          />
        </div>
      </div>
    </FormStep>
  );
};

export default SkillsStep;

