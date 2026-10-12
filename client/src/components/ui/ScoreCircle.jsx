import React from "react";

const colorMap = {
  indigo: { stroke: "#6366f1", bg: "bg-primary-50", text: "text-primary-600" },
  green: { stroke: "#22c55e", bg: "bg-success-50", text: "text-success-600" },
  red: { stroke: "#ef4444", bg: "bg-danger-50", text: "text-danger-600" },
  amber: { stroke: "#f59e0b", bg: "bg-warning-50", text: "text-warning-600" },
  blue: { stroke: "#3b82f6", bg: "bg-blue-50", text: "text-blue-600" },
};

const ScoreCircle = ({ score = 0, size = 200, label, color = "indigo" }) => {
  const theme = colorMap[color] || colorMap.indigo;
  const strokeWidth = size * 0.07;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math * radius;
  const offset = circumference - (score / 100) * circumference;
  const fontSize = size * 0.22;
  const labelSize = size * 0.075;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={theme.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            className="animate-score-fill"
            style={{ "--score-offset": offset }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-bold ${theme.text}`}
            style={{ fontSize }}
          >
            {score}
          </span>
          <span
            className="text-surface-400 font-medium"
            style={{ fontSize: labelSize }}
          >
            / 100
          </span>
        </div>
      </div>
      {label && (
        <span className="text-sm font-medium text-surface-600">{label}</span>
      )}
    </div>
  );
};

export default ScoreCircle;
