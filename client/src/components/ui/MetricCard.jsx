import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const colorMap = {
  indigo: "bg-primary-50 text-primary-600",
  green: "bg-success-50 text-success-600",
  red: "bg-danger-50 text-danger-600",
  amber: "bg-warning-50 text-warning-600",
  blue: "bg-blue-50 text-blue-600",
};

const trendColors = {
  up: "text-success-600",
  down: "text-danger-600",
  neutral: "text-surface-400",
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const MetricCard = ({
  icon: Icon,
  value,
  label,
  trend,
  trendDirection = "neutral",
  color = "indigo",
}) => {
  const TrendIcon = trendIcons[trendDirection] || Minus;

  return (
    <div className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div
            className={`inline-flex items-center justify-center w-11 h-11 rounded-lg ${colorMap[color] || colorMap.indigo}`}
          >
            {Icon && <Icon size={20} />}
          </div>
          <div>
            <p className="text-2xl font-bold text-surface-900">{value}</p>
            <p className="text-sm text-surface-500 mt-0.5">{label}</p>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trendColors[trendDirection]}`}>
            <TrendIcon size={14} />
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
