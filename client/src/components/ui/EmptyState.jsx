import React from "react";

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-surface-100 mb-5">
          <Icon size={24} className="text-surface-400" />
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-surface-900 mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-surface-500 max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
