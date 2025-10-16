// components/common/EmptyState.jsx
import React from 'react';

export const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="text-center py-12 text-gray-500">
      {Icon && <Icon className="w-16 h-16 mx-auto mb-4 text-gray-400" />}
      <p className="text-lg font-medium mb-2">{title}</p>
      {description && <p className="text-sm mb-4">{description}</p>}
      {action && action}
    </div>
  );
};