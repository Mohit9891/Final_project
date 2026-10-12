import React from "react";

const variantStyles = {
  matched: "bg-success-50 text-success-600 border-success-500/20",
  missing: "bg-danger-50 text-danger-600 border-danger-500/20",
  default: "bg-surface-100 text-surface-600 border-surface-200",
};

const sizeStyles = {
  sm: "px-2.5 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

const SkillBadge = ({
  skill,
  variant = "default",
  size = "md",
}) => {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-colors ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size] || sizeStyles.md}`}
    >
      {skill}
    </span>
  );
};

export default SkillBadge;
