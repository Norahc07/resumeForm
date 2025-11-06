import { useToast } from '../context/ToastContext';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  const getToastStyles = (type) => {
    const baseStyles = 'fixed top-4 right-4 z-50 max-w-sm w-full shadow-lg rounded-lg pointer-events-auto';
    const typeStyles = {
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      warning: 'bg-yellow-500 text-black',
      info: 'bg-blue-500 text-white'
    };
    return `${baseStyles} ${typeStyles[type] || typeStyles.info}`;
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={getToastStyles(toast.type)}
          role="alert"
        >
          <div className="p-4 flex items-center justify-between">
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-white hover:text-gray-200 focus:outline-none"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;

