const FormStep = ({ step, currentStep, title, children }) => {
  const isActive = step === currentStep;
  const isCompleted = step < currentStep;

  return (
    <div className={`${isActive ? 'block animate-fadeIn' : 'hidden'}`}>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
          {title}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>
      </div>
      <div className="animate-slideIn">
        {children}
      </div>
    </div>
  );
};

export default FormStep;

