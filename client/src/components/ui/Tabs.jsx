import React from "react";

const Tabs = ({ tabs = [], activeTab, onChange }) => {
  return (
    <div className="border-b border-surface-200">
      <nav className="flex gap-0 -mb-px">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 -mb-px ${
                isActive
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300"
              }`}
            >
              {tab.icon && <tab.icon size={16} />}
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Tabs;
