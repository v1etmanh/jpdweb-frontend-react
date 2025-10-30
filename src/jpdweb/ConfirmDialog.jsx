import React from 'react';
import { AlertTriangle, X, ArrowLeft, Check } from 'lucide-react';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Xác nhận", 
  message, 
  confirmText = "Xác nhận", 
  cancelText = "Hủy",
  type = "warning" // warning, danger, info
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconColor: 'text-red-500',
          iconBg: 'bg-red-100',
          confirmButton: 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
        };
      case 'info':
        return {
          iconColor: 'text-blue-500',
          iconBg: 'bg-blue-100',
          confirmButton: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
        };
      default: // warning
        return {
          iconColor: 'text-orange-500',
          iconBg: 'bg-orange-100',
          confirmButton: 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500'
        };
    }
  };

  const typeStyles = getTypeStyles();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform animate-scale-in">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-3 rounded-2xl ${typeStyles.iconBg} mr-4`}>
                <AlertTriangle className={`w-6 h-6 ${typeStyles.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          <p className="text-gray-600 leading-relaxed text-base">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl font-semibold transition-all duration-300 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-3 text-white rounded-2xl font-semibold transition-all duration-300 flex items-center shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${typeStyles.confirmButton}`}
          >
            <Check className="w-4 h-4 mr-2" />
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;