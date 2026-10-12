import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Briefcase,
  Upload,
  Clock,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import MetricCard from "../components/ui/MetricCard";
import ScoreCircle from "../components/ui/ScoreCircle";
import ProgressBar from "../components/ui/ProgressBar";
import SectionCard from "../components/ui/SectionCard";

const subScores = [
  { label: "ATS Compatibility", value: 88, color: "green" },
  { label: "Content Quality", value: 81, color: "indigo" },
  { label: "Skills", value: 79, color: "amber" },
  { label: "Experience", value: 84, color: "blue" },
  { label: "Formatting", value: 90, color: "green" },
];

const topJobs = [
  {
    company: "Google",
    role: "Senior Frontend Engineer",
    match: 94,
    skills: ["React", "TypeScript", "GraphQL"],
  },
  {
    company: "Stripe",
    role: "Full Stack Developer",
    match: 87,
    skills: ["Node.js", "React", "PostgreSQL"],
  },
  {
    company: "Notion",
    role: "Software Engineer",
    match: 82,
    skills: ["React", "Python", "AWS"],
  },
];

const recentActivity = [
  {
    icon: FileText,
    text: "Resume analyzed — scored 88/100 on ATS",
    time: "2 hours ago",
  },
  {
    icon: AlertTriangle,
    text: "12 missing keywords identified",
    time: "2 hours ago",
  },
  {
    icon: Briefcase,
    text: "37 new job matches found",
    time: "2 hours ago",
  },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            {getGreeting()}, {user?.name || "there"} 👋
          </h1>
          <p className="text-surface-500 mt-1">
            Here's how your resume is performing today.
          </p>
        </div>
        <Link
          to="/app/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm self-start"
        >
          <Upload size={16} />
          Upload New Resume
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={TrendingUp}
          value="88%"
          label="ATS Score"
          trend="+5% from last"
          trendDirection="up"
          color="green"
        />
        <MetricCard
          icon={AlertTriangle}
          value="12"
          label="Missing Keywords"
          trend="Add to improve"
          trendDirection="neutral"
          color="amber"
        />
        <MetricCard
          icon={CheckCircle}
          value="24"
          label="Matched Skills"
          trend="Strong coverage"
          trendDirection="neutral"
          color="green"
        />
        <MetricCard
          icon={Briefcase}
          value="37"
          label="Job Matches"
          trend="Based on resume"
          trendDirection="neutral"
          color="blue"
        />
      </div>

      {/* Resume Health + Job Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Resume Health */}
        <SectionCard className="lg:col-span-2" title="Resume Health">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="shrink-0">
              <ScoreCircle score={82} size={180} color="indigo" />
            </div>

            <div className="flex-1 w-full space-y-5">
              <p className="text-sm text-surface-600">
                <span className="font-semibold text-surface-900">Good</span> — your resume is competitive
              </p>

              <div className="space-y-4">
                {subScores.map((item) => (
                  <ProgressBar
                    key={item.label}
                    value={item.value}
                    label={item.label}
                    color={item.color}
                  />
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Right — Top Job Matches */}
        <SectionCard
          title="Top Job Matches"
          action={
            <span className="text-xs font-medium text-primary-600 cursor-pointer hover:underline">
              View all
            </span>
          }
        >
          <div className="space-y-4">
            {topJobs.map((job, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-surface-100 hover:border-surface-200 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-surface-900 truncate">
                      {job.role}
                    </p>
                    <p className="text-xs text-surface-500 mt-0.5">{job.company}</p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-success-50 text-success-600">
                    {job.match}%
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-surface-100 text-surface-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Recent Activity */}
      <SectionCard title="Recent Activity">
        <div className="divide-y divide-surface-100">
          {recentActivity.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-surface-100 text-surface-500 shrink-0">
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-surface-700">{item.text}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-surface-400 shrink-0">
                  <Clock size={12} />
                  <span>{item.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
};

export default Dashboard;
