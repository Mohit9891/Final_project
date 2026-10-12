import React, { useState } from "react";
import { Edit, ChevronDown, BookOpen, Clock } from "lucide-react";
import SkillBadge from "../components/ui/SkillBadge";
import SectionCard from "../components/ui/SectionCard";

const currentSkills = [
  { name: "JavaScript", level: 3 },
  { name: "React", level: 3 },
  { name: "Node.js", level: 2 },
  { name: "TypeScript", level: 2 },
  { name: "Git", level: 3 },
  { name: "HTML/CSS", level: 3 },
  { name: "REST APIs", level: 2 },
  { name: "SQL", level: 2 },
];

const targetRoles = {
  "Senior Software Engineer": ["AWS", "System Design", "Kubernetes", "Redis", "Kafka", "GraphQL"],
  "Tech Lead": ["AWS", "System Design", "Kubernetes", "Redis", "Kafka", "GraphQL", "Team Leadership", "Architecture"],
  "Full Stack Developer": ["AWS", "System Design", "Kubernetes", "Redis", "Kafka", "GraphQL", "Docker", "MongoDB"],
};

const learningPath = [
  { skill: "AWS", difficulty: "Intermediate", time: "6 weeks", description: "Cloud services, EC2, S3, Lambda, and deployment best practices." },
  { skill: "System Design", difficulty: "Advanced", time: "8 weeks", description: "Scalability, load balancing, caching, and distributed systems." },
  { skill: "Kubernetes", difficulty: "Intermediate", time: "5 weeks", description: "Container orchestration, pods, services, and Helm charts." },
  { skill: "Redis", difficulty: "Beginner", time: "3 weeks", description: "In-memory data store, caching strategies, and pub/sub." },
  { skill: "Kafka", difficulty: "Advanced", time: "7 weeks", description: "Event streaming, topics, consumers, and real-time pipelines." },
  { skill: "GraphQL", difficulty: "Intermediate", time: "4 weeks", description: "Schema design, resolvers, subscriptions, and Apollo Server." },
];

const SkillGap = () => {
  const [targetRole, setTargetRole] = useState("Senior Software Engineer");

  const requiredSkills = targetRoles[targetRole];
  const matchedSkills = currentSkills.filter((s) => requiredSkills.includes(s.name)).map((s) => s.name);
  const missingSkills = requiredSkills.filter((s) => !currentSkills.map((cs) => cs.name).includes(s));

  const getLevelDots = (level) => (
    <div className="flex gap-1 mt-1">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${i <= level ? "bg-primary-500" : "bg-surface-200"}`}
        />
      ))}
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-surface-900">Skill Gap Analysis</h1>
        <p className="text-sm text-surface-500 mt-1">Discover skills you need to advance your career.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <SectionCard className="flex-1 w-full" title="Current Role">
          <div className="flex items-center justify-between">
            <span className="text-surface-900 font-medium">Software Engineer</span>
            <button className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
              <Edit size={16} />
            </button>
          </div>
        </SectionCard>

        <SectionCard className="flex-1 w-full" title="Target Role">
          <div className="relative">
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full appearance-none bg-transparent pr-8 text-surface-900 font-medium cursor-pointer"
            >
              {Object.keys(targetRoles).map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SectionCard title="Your Current Skills" subtitle={`${currentSkills.length} skills`}>
          <div className="space-y-3">
            {currentSkills.map((skill) => (
              <div key={skill.name} className="flex items-center justify-between">
                <SkillBadge skill={skill.name} />
                {getLevelDots(skill.level)}
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={`Skills for ${targetRole}`} subtitle={`${matchedSkills.length} matched · ${missingSkills.length} missing`}>
          <div className="space-y-2.5">
            {matchedSkills.map((skill) => (
              <SkillBadge key={skill} skill={skill} variant="matched" />
            ))}
            {missingSkills.map((skill) => (
              <SkillBadge key={skill} skill={skill} variant="missing" />
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Recommended Learning Path" subtitle="Build the skills to reach your target role">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {learningPath.map((item) => (
            <div
              key={item.skill}
              className="border border-surface-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                  <BookOpen size={16} className="text-primary-600" />
                </div>
                <h4 className="text-sm font-semibold text-surface-900">{item.skill}</h4>
              </div>
              <p className="text-xs text-surface-500 mb-3 line-clamp-2">{item.description}</p>
              <div className="flex items-center gap-3 text-xs text-surface-400 mb-4">
                <span className="px-2 py-0.5 rounded-full bg-surface-100">{item.difficulty}</span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} />
                  {item.time}
                </span>
              </div>
              <button className="w-full text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg py-2 transition-colors">
                Start Learning
              </button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default SkillGap;
