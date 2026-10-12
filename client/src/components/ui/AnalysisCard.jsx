import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight } from "lucide-react";

const statusStyles = {
  good: {
    iconBg: "bg-success-50",
    iconColor: "text-success-600",
    border: "border-success-500/20",
    Icon: CheckCircle2,
  },
  warning: {
    iconBg: "bg-warning-50",
    iconColor: "text-warning-600",
    border: "border-warning-500/20",
    Icon: AlertTriangle,
  },
  error: {
    iconBg: "bg-danger-50",
    iconColor: "text-danger-600",
    border: "border-danger-500/20",
    Icon: XCircle,
  },
};

const AnalysisCard = ({ icon: CustomIcon, title, description, status = "good", action }) => {
  const config = statusStyles[status] || statusStyles.good;
  const DisplayIcon = CustomIcon || config.Icon;

  return (
    <div
      className={`bg-white rounded-xl border shadow-sm p-5 transition-all duration-200 hover:shadow-md ${config.border}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${config.iconBg}`}
        >
          <DisplayIcon size={20} className={config.iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-surface-900">{title}</h4>
          {description && (
            <p className="text-sm text-surface-500 mt-1">{description}</p>
          )}
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors shrink-0"
          >
            {action.label}
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AnalysisCard;
