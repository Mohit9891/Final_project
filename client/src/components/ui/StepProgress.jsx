import React from "react";
import { Check, Loader2 } from "lucide-react";

const statusConfig = {
  done: {
    circle: "bg-primary-600 border-primary-600",
    icon: <Check size={14} className="text-white" />,
    label: "text-surface-900 font-medium",
    connector: "bg-primary-600",
  },
  active: {
    circle: "bg-white border-primary-600 ring-4 ring-primary-50",
    icon: <Loader2 size={14} className="text-primary-600 animate-spin" />,
    label: "text-primary-600 font-semibold",
    connector: "bg-surface-200",
  },
  pending: {
    circle: "bg-white border-surface-300",
    icon: null,
    label: "text-surface-400",
    connector: "bg-surface-200",
  },
};

const StepProgress = ({ steps = [] }) => {
  return (
    <div className="flex items-center">
      {steps.map((step, i) => {
        const config = statusConfig[step.status] || statusConfig.pending;
        const isLast = i === steps.length - 1;

        return (
          <React.Fragment key={i}>
            <div className="flex items-center gap-2.5">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all duration-300 ${config.circle}`}
              >
                {config.icon}
              </div>
              <span className={`text-sm whitespace-nowrap ${config.label}`}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mx-3 rounded-full transition-colors duration-300 min-w-[2rem] ${config.connector}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepProgress;
