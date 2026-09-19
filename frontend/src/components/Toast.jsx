import React from 'react';
import { X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor =
    type === 'success'
      ? 'bg-green-600/20 border-green-500/50'
      : type === 'error'
      ? 'bg-red-600/20 border-red-500/50'
      : 'bg-blue-600/20 border-blue-500/50';

  const textColor =
    type === 'success'
      ? 'text-green-400'
      : type === 'error'
      ? 'text-red-400'
      : 'text-blue-400';

  return (
    <div
      className={`fixed top-24 right-4 max-w-sm card ${bgColor} border animate-slideDown`}
    >
      <div className="flex items-center justify-between gap-4">
        <p className={`${textColor} font-medium`}>{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
