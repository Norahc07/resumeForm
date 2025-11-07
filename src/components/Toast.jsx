import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';

const Toast = () => {
  const { toasts, removeToast } = useToast();
  const [visibleToasts, setVisibleToasts] = useState([]);

  useEffect(() => {
    // Animate toasts in
    setVisibleToasts(toasts.map(t => ({ ...t, isVisible: true })));
  }, [toasts]);

  const getToastStyles = (type) => {
    const baseStyles = 'relative overflow-hidden backdrop-blur-sm border';
    const typeStyles = {
      success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400/30 shadow-green-500/20',
      error: 'bg-gradient-to-r from-red-500 to-rose-500 text-white border-red-400/30 shadow-red-500/20',
      warning: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-yellow-300/30 shadow-yellow-500/20',
      info: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-400/30 shadow-blue-500/20'
    };
    return `${baseStyles} ${typeStyles[type] || typeStyles.info}`;
  };

  const getIcon = (type) => {
    const iconClass = "w-5 h-5 flex-shrink-0";
    switch (type) {
      case 'success':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'error':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const handleRemove = (id) => {
    setVisibleToasts(prev => prev.map(t => t.id === id ? { ...t, isVisible: false } : t));
    setTimeout(() => removeToast(id), 300);
  };

  return (
    <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-[9999] space-y-3 pointer-events-none">
      {visibleToasts.map((toast, index) => (
        <div
          key={toast.id}
          className={`${getToastStyles(toast.type)} rounded-xl shadow-2xl pointer-events-auto transform transition-all duration-300 ease-out ${
            toast.isVisible 
              ? 'translate-x-0 opacity-100 scale-100' 
              : 'translate-x-full opacity-0 scale-95'
          }`}
          style={{
            animation: toast.isVisible ? 'slideInRight 0.3s ease-out' : 'slideOutRight 0.3s ease-out',
            zIndex: 9999 - index
          }}
          role="alert"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          
          <div className="relative p-4 flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(toast.type)}
            </div>
            
            {/* Message */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-relaxed break-words">{toast.message}</p>
            </div>
            
            {/* Close Button */}
            <button
              onClick={() => handleRemove(toast.id)}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-white/20 active:bg-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 overflow-hidden">
            <div 
              className="h-full bg-white/60 animate-progress"
              style={{ animationDuration: '3s', animationTimingFunction: 'linear' }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;

