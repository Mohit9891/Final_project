import React, { useState } from "react";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Search,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import ScoreCircle from "../components/ui/ScoreCircle";
import SkillBadge from "../components/ui/SkillBadge";
import SectionCard from "../components/ui/SectionCard";

const mockResults = {
  score: 87,
  matchedSkills: [
    "React",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "REST APIs",
    "HTML",
    "CSS",
    "Git",
  ],
  missingSkills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
  allRequiredSkills: [
    "React",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "REST APIs",
    "HTML",
    "CSS",
    "Git",
    "AWS",
    "Docker",
    "Kubernetes",
    "CI/CD",
  ],
  suggestions: [
    "Add experience with AWS cloud services (EC2, S3, Lambda) to your resume.",
    "Include any Docker or containerization projects you've worked on.",
    "Mention CI/CD pipeline experience, even if informal (GitHub Actions, Jenkins).",
    "Highlight any infrastructure or DevOps tasks from your current role.",
    "Consider adding a 'Tools & Technologies' section to list cloud and DevOps skills.",
  ],
};

const JdAnalyzer = () => {
  const [jdText, setJdText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnalyze = () => {
    if (!jdText.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setResults(mockResults);
      setIsAnalyzing(false);
    }, 2000);
  };

  const reset = () => {
    setJdText("");
    setResults(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Analyze a Job Description</h1>
        <p className="text-surface-500 text-sm mt-1">
          Paste a job description to see how well your resume matches.
        </p>
      </div>

      {!results ? (
        <SectionCard>
          <div className="space-y-4">
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the job description here..."
              rows={12}
              className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-lg text-sm text-surface-900 placeholder:text-surface-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={handleAnalyze}
                disabled={!jdText.trim() || isAnalyzing}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAnalyzing ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Analyze Job
                  </>
                )}
              </button>
              {isAnalyzing && (
                <p className="text-sm text-surface-500">
                  Comparing with your resume...
                </p>
              )}
            </div>
          </div>
        </SectionCard>
      ) : (
        <div className="space-y-6">
          <SectionCard>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ScoreCircle score={results.score} size={140} label="Match Score" />
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-surface-900">
                  {results.score}% Match
                </h2>
                <p className="text-surface-500 mt-1">
                  Your resume matches {results.matchedSkills.length} of{" "}
                  {results.allRequiredSkills.length} required skills.
                </p>
                <button
                  onClick={reset}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <FileText size={14} />
                  Analyze another job description
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Required Skills">
            <div className="flex flex-wrap gap-2">
              {results.allRequiredSkills.map((skill) => (
                <SkillBadge
                  key={skill}
                  skill={skill}
                  variant={results.matchedSkills.includes(skill) ? "matched" : "missing"}
                />
              ))}
            </div>
          </SectionCard>

          {results.missingSkills.length > 0 && (
            <SectionCard
              title="Missing Skills"
              subtitle="These skills are required but not found in your resume"
            >
              <div className="flex flex-wrap gap-2">
                {results.missingSkills.map((skill) => (
                  <SkillBadge key={skill} skill={skill} variant="missing" />
                ))}
              </div>
            </SectionCard>
          )}

          <SectionCard title="Resume Improvement Suggestions">
            <ul className="space-y-3">
              {results.suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm text-surface-700"
                >
                  <ArrowRight
                    size={16}
                    className="text-primary-500 shrink-0 mt-0.5"
                  />
                  {suggestion}
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      )}
    </div>
  );
};

export default JdAnalyzer;
