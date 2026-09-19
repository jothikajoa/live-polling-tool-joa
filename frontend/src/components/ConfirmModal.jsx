import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const ConfirmModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
  type = 'warning',
}) => {
  const Icon = type === 'danger' ? AlertCircle : CheckCircle;
  const iconColor =
    type === 'danger' ? 'text-red-400' : 'text-blue-400';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="card min-w-80 max-w-md">
        <div className="flex items-start space-x-4 mb-6">
          <Icon className={`${iconColor} flex-shrink-0`} size={24} />
          <div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-gray-400 text-sm mt-1">{message}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Loading...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
