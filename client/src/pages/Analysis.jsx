import React, { useState } from "react";
import {
  FileText,
  Briefcase,
  GraduationCap,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
} from "lucide-react";
import ScoreCircle from "../components/ui/ScoreCircle";
import ProgressBar from "../components/ui/ProgressBar";
import SkillBadge from "../components/ui/SkillBadge";
import Tabs from "../components/ui/Tabs";
import SectionCard from "../components/ui/SectionCard";
import AnalysisCard from "../components/ui/AnalysisCard";

const TABS = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "ats", label: "ATS", icon: Sparkles },
  { id: "skills", label: "Skills", icon: Briefcase },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "suggestions", label: "Suggestions", icon: Lightbulb },
];

const skillsFound = [
  { name: "React", matched: true },
  { name: "JavaScript", matched: true },
  { name: "TypeScript", matched: true },
  { name: "Node.js", matched: true },
  { name: "Python", matched: true },
  { name: "REST APIs", matched: true },
  { name: "SQL", matched: true },
  { name: "Git", matched: true },
  { name: "CSS", matched: true },
  { name: "HTML", matched: true },
];

const recommendedSkills = ["AWS", "Docker", "Kubernetes", "GraphQL", "CI/CD"];

const experienceItems = [
  {
    company: "TechCorp Inc.",
    position: "Senior Software Engineer",
    startDate: "Jan 2022",
    endDate: "Present",
    description:
      "Led development of a microservices architecture serving 2M+ users. Reduced API response time by 40% through query optimization and caching strategies. Mentored a team of 4 junior developers.",
    quality: "good",
  },
  {
    company: "StartupXYZ",
    position: "Full Stack Developer",
    startDate: "Jun 2019",
    endDate: "Dec 2021",
    description:
      "Built and deployed 3 customer-facing applications using React and Node.js. Implemented CI/CD pipelines reducing deployment time by 60%. Collaborated with design team to improve UX.",
    quality: "warning",
  },
  {
    company: "WebAgency Co.",
    position: "Junior Developer",
    startDate: "Aug 2017",
    endDate: "May 2019",
    description:
      "Developed responsive websites for 15+ clients. Maintained WordPress sites and custom themes. Participated in daily standups and sprint planning.",
    quality: "good",
  },
];

const educationItems = [
  {
    institution: "State University",
    degree: "Bachelor of Science in Computer Science",
    startDate: "2013",
    endDate: "2017",
    gpa: "3.7",
  },
  {
    institution: "Online Learning Platform",
    degree: "Advanced React Development Certificate",
    startDate: "2021",
    endDate: "2021",
    gpa: null,
  },
];

const suggestions = [
  {
    title: "Missing Keywords",
    current: "Experienced software engineer with a track record of delivering quality software.",
    suggestion:
      "Experienced software engineer with expertise in React, TypeScript, Node.js, and cloud technologies (AWS, Docker). Proven track record of delivering scalable, high-performance applications.",
  },
  {
    title: "Weak Bullet Points",
    current: "Worked on various projects and helped the team.",
    suggestion:
      "Architected and delivered 3 customer-facing applications using React and Node.js, resulting in a 25% increase in user engagement. Implemented automated testing that reduced QA cycle time by 40%.",
  },
  {
    title: "Missing Quantified Results",
    current: "Improved application performance.",
    suggestion:
      "Improved application performance by 45% through implementation of code-splitting, lazy loading, and Redis caching, reducing average page load time from 3.2s to 1.8s.",
  },
];

const OverviewTab = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row items-center gap-8">
      <ScoreCircle score={82} size={160} label="Overall Score" />
      <div className="grid grid-cols-2 gap-4 flex-1">
        <SectionCard className="text-center">
          <p className="text-3xl font-bold text-primary-600">24</p>
          <p className="text-sm text-surface-500 mt-1">Skills Matched</p>
        </SectionCard>
        <SectionCard className="text-center">
          <p className="text-3xl font-bold text-success-600">88%</p>
          <p className="text-sm text-surface-500 mt-1">ATS Score</p>
        </SectionCard>
        <SectionCard className="text-center">
          <p className="text-3xl font-bold text-warning-600">3</p>
          <p className="text-sm text-surface-500 mt-1">Issues Found</p>
        </SectionCard>
        <SectionCard className="text-center">
          <p className="text-3xl font-bold text-blue-600">92%</p>
          <p className="text-sm text-surface-500 mt-1">Keyword Match</p>
        </SectionCard>
      </div>
    </div>

    <div className="space-y-4">
      <AnalysisCard
        status="good"
        title="Strong formatting"
        description="Your resume is well-structured with clear sections and consistent formatting that is easy to read."
      />
      <AnalysisCard
        status="warning"
        title="Missing keywords"
        description="Your resume is missing several important keywords from the job description. Add them to improve ATS matching."
      />
      <AnalysisCard
        status="warning"
        title="Weak bullet points"
        description="Some bullet points lack quantified achievements. Use numbers and metrics to make your impact more tangible."
      />
    </div>
  </div>
);

const ATSTab = () => (
  <div className="space-y-8">
    <h3 className="text-2xl font-bold text-surface-900">88% ATS Compatibility</h3>

    <SectionCard title="Compatibility Breakdown">
      <div className="space-y-4">
        <ProgressBar value={92} label="Keyword Matching" color="green" />
        <ProgressBar value={86} label="Formatting" color="indigo" />
        <ProgressBar value={91} label="Structure" color="green" />
        <ProgressBar value={82} label="Section Detection" color="amber" />
      </div>
    </SectionCard>

    <div className="space-y-4">
      <AnalysisCard
        status="warning"
        title="Missing important keywords"
        description="Keywords like 'microservices', 'cloud architecture', and 'system design' are missing. Add them naturally to your resume."
      />
      <AnalysisCard
        status="warning"
        title="Weak bullet points detected"
        description="Some bullet points are vague. Add specific metrics like 'reduced load time by 40%' to demonstrate impact."
      />
      <AnalysisCard
        status="good"
        title="Good formatting detected"
        description="Your resume uses consistent formatting, proper headings, and is ATS-friendly in its structure."
      />
    </div>
  </div>
);

const SkillsTab = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <SectionCard title="Skills Found" subtitle={`${skillsFound.length} skills matched`}>
      <div className="flex flex-wrap gap-2">
        {skillsFound.map((skill) => (
          <SkillBadge key={skill.name} skill={skill.name} variant="matched" />
        ))}
      </div>
    </SectionCard>

    <SectionCard title="Skill Gap" subtitle="Skills you may want to add">
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-2">You Have</p>
          <div className="flex flex-wrap gap-2">
            {skillsFound.slice(0, 6).map((skill) => (
              <SkillBadge key={skill.name} skill={skill.name} variant="matched" size="sm" />
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-2">Recommended</p>
          <div className="flex flex-wrap gap-2">
            {recommendedSkills.map((skill) => (
              <SkillBadge key={skill} skill={skill} variant="missing" size="sm" />
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  </div>
);

const ExperienceTab = () => (
  <div className="space-y-4">
    {experienceItems.map((item, index) => (
      <SectionCard
        key={index}
        title={item.position}
        subtitle={item.company}
        action={
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
              item.quality === "good"
                ? "bg-success-50 text-success-600"
                : "bg-warning-50 text-warning-600"
            }`}
          >
            {item.quality === "good" ? (
              <CheckCircle2 size={12} />
            ) : (
              <AlertTriangle size={12} />
            )}
            {item.quality === "good" ? "Strong" : "Needs Work"}
          </span>
        }
      >
        <p className="text-sm text-surface-500 mb-3">
          {item.startDate} – {item.endDate}
        </p>
        <p className="text-sm text-surface-700 leading-relaxed">{item.description}</p>
      </SectionCard>
    ))}
  </div>
);

const EducationTab = () => (
  <div className="space-y-4">
    {educationItems.map((item, index) => (
      <SectionCard key={index} title={item.degree} subtitle={item.institution}>
        <p className="text-sm text-surface-500">
          {item.startDate} – {item.endDate}
        </p>
        {item.gpa && <p className="text-sm text-surface-700 mt-1">GPA: {item.gpa}</p>}
      </SectionCard>
    ))}
  </div>
);

const SuggestionsTab = () => (
  <div className="space-y-4">
    {suggestions.map((item, index) => (
      <SectionCard key={index} title={item.title}>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">Current</p>
            <blockquote className="border-l-2 border-surface-200 pl-3 text-sm text-surface-600 italic">
              {item.current}
            </blockquote>
          </div>
          <div>
            <p className="text-xs font-semibold text-success-600 uppercase tracking-wide mb-1.5">AI Suggestion</p>
            <p className="text-sm text-surface-700 leading-relaxed">{item.suggestion}</p>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
              <CheckCircle2 size={14} />
              Apply Suggestion
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-surface-600 bg-surface-100 rounded-lg hover:bg-surface-200 transition-colors">
              <XCircle size={14} />
              Ignore
            </button>
          </div>
        </div>
      </SectionCard>
    ))}
  </div>
);

const Analysis = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "ats":
        return <ATSTab />;
      case "skills":
        return <SkillsTab />;
      case "experience":
        return <ExperienceTab />;
      case "education":
        return <EducationTab />;
      case "suggestions":
        return <SuggestionsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Resume Analysis</h1>
        <p className="text-surface-500 text-sm mt-1">
          Detailed breakdown of your resume's strengths and areas for improvement.
        </p>
      </div>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="pt-4">{renderTab()}</div>
    </div>
  );
};

export default Analysis;
