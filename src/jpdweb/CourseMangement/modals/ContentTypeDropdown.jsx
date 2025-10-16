// components/modals/ContentTypeDropdown.jsx
import React from 'react';
import { X } from 'lucide-react';
import { CONTENT_TYPES } from '../../constants/contentTypes';

export const ContentTypeDropdown = ({ isOpen, onClose, onSelect, position }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-10" onClick={onClose} />

      {/* Dropdown */}
      <div
        className="absolute right-0 top-12 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto"
        style={position}
      >
        <div className="p-3 border-b border-gray-200 bg-gray-50 sticky top-0">
          <h4 className="font-semibold text-gray-800">Select Content Type</h4>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 hover:bg-gray-200 rounded"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 p-3">
          {Object.entries(CONTENT_TYPES).map(([type, config]) => {
            const IconComponent = config.icon;
            return (
              <button
                key={type}
                onClick={() => {
                  onSelect(type);
                  onClose();
                }}
                className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors group"
              >
                <IconComponent
                  className={`w-6 h-6 ${config.color} group-hover:scale-110 transition-transform`}
                />
                <span className="text-xs text-center font-medium text-gray-700">
                  {config.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};