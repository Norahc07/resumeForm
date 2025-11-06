const FormStep = ({ step, currentStep, title, children }) => {
  const isActive = step === currentStep;
  const isCompleted = step < currentStep;

  return (
    <div className={`${isActive ? 'block' : 'hidden'}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <div className="flex items-center space-x-2">
          <div className={`flex-1 h-2 rounded-full ${isCompleted ? 'bg-blue-600' : isActive ? 'bg-blue-300' : 'bg-gray-200'}`}></div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default FormStep;

