import React from "react";

const colorMap = {
  indigo: "bg-primary-500",
  green: "bg-success-500",
  red: "bg-danger-500",
  amber: "bg-warning-500",
  blue: "bg-blue-500",
};

const ProgressBar = ({ value = 0, label, color = "indigo" }) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full space-y-2">
      {(label || clampedValue > 0) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-sm font-medium text-surface-700">{label}</span>}
          <span className="text-sm font-semibold text-surface-900">{clampedValue}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colorMap[color] || colorMap.indigo}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
