import React, { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Search,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Briefcase,
  DollarSign,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react";
import SkillBadge from "../components/ui/SkillBadge";
import SectionCard from "../components/ui/SectionCard";
import api from "../configs/api";
import { useSelector } from "react-redux";

const filterOptions = ["Remote", "Hybrid", "On-site", "Full-time", "Part-time"];

const getMatchColor = (match) => {
  if (match >= 90) return "bg-success-50 text-success-700 border-success-200";
  if (match >= 80) return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-warning-50 text-warning-700 border-warning-200";
};

const getJobType = (job) => {
  if (job.isRemote) return "Remote";
  if (job.employmentType?.includes("Remote")) return "Remote";
  if (job.employmentType?.includes("Full-time")) return "Full-time";
  if (job.employmentType?.includes("Part-time")) return "Part-time";
  return "On-site";
};

const extractSkills = (description, requiredSkills, tags) => {
  const commonSkills = [
    "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "Go",
    "Rust", "C++", "SQL", "MongoDB", "PostgreSQL", "AWS", "Docker", "Kubernetes",
    "Git", "REST", "GraphQL", "HTML", "CSS", "Tailwind", "Next.js", "Vue",
    "Angular", "Express", "Django", "Flask", "Spring", "Redis", "Kafka",
    "Terraform", "CI/CD", "Linux", "Figma", "Swift", "Kotlin", "Ruby", "PHP",
  ];

  const text = (description || "").toLowerCase();
  const found = commonSkills.filter(
    (s) => text.includes(s.toLowerCase()) || (requiredSkills || []).some((rs) => rs.toLowerCase().includes(s.toLowerCase()))
  );
  const fromTags = (tags || []).filter((t) => typeof t === "string");
  return [...new Set([...(requiredSkills || []), ...fromTags, ...found])].slice(0, 8);
};

const estimateMatch = (userSkills, jobSkills) => {
  if (!jobSkills.length) return 70;
  const matched = jobSkills.filter((s) =>
    userSkills.some((us) => us.toLowerCase() === s.toLowerCase())
  );
  return Math.min(99, Math.round((matched.length / jobSkills.length) * 100) + 20);
};

const JobMatches = () => {
  const { token } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("software engineer");
  const [userSkills, setUserSkills] = useState([]);

  useEffect(() => {
    if (!token) return;
    api
      .get("/api/users/skills", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        const newSkills = data.skills || [];
        const newRole = data.roles?.[0];
        if (newSkills.length) setUserSkills(newSkills);
        if (newRole) {
          setSearchQuery(newRole);
          fetchJobs(newRole);
        }
      })
      .catch(() => {});
  }, [token]);

  const fetchJobs = useCallback(async (query) => {
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/api/jobs/search`, {
        params: { query, num_pages: 1 },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setJobs(data.jobs || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchJobs(searchQuery);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setSearchQuery(search.trim());
      fetchJobs(search.trim());
    }
  };

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const toggleSave = async (job) => {
    const jobId = job.id;
    const isSaving = !savedJobs.includes(jobId);

    setSavedJobs((prev) =>
      isSaving ? [...prev, jobId] : prev.filter((id) => id !== jobId)
    );

    if (isSaving) {
      try {
        await api.post(
          "/api/applications",
          {
            jobId,
            jobTitle: job.title,
            company: job.company,
            companyLogo: job.companyLogo,
            location: job.location,
            salary: job.salary,
            applyUrl: job.applyUrl,
            source: job.source,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Saved to applications!");
      } catch (error) {
        setSavedJobs((prev) => prev.filter((id) => id !== jobId));
        toast.error(error?.response?.data?.message || "Failed to save");
      }
    }
  };

  const fallbackSkills = ["React", "JavaScript", "Node.js", "Python", "SQL", "MongoDB", "TypeScript", "Git", "HTML", "CSS"];
  const activeUserSkills = userSkills.length > 0 ? userSkills : fallbackSkills;

  const processedJobs = jobs.map((job) => {
    const jobSkills = extractSkills(job.description, job.skills, job.tags);
    const matched = jobSkills.filter((s) =>
      activeUserSkills.some((us) => us.toLowerCase() === s.toLowerCase())
    );
    const missing = jobSkills.filter((s) =>
      !activeUserSkills.some((us) => us.toLowerCase() === s.toLowerCase())
    );
    return {
      ...job,
      jobSkills,
      matchedSkills: matched,
      missingSkills: missing,
      match: estimateMatch(userSkills, jobSkills),
      type: getJobType(job),
    };
  });

  const filteredJobs = processedJobs.filter((job) => {
    const matchesSearch =
      search === "" ||
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.toLowerCase().includes(search.toLowerCase()) ||
      job.location?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilters.length === 0 || activeFilters.includes(job.type);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Jobs matched for you</h1>
          <p className="text-surface-500 text-sm mt-1">
            Based on your resume, skills and career goals.
          </p>
        </div>
        <button
          onClick={() => fetchJobs(searchQuery)}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-surface-600 bg-white border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {userSkills.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg px-4 py-2.5 text-sm text-primary-700">
          Matching against <strong>{userSkills.length} skills</strong> from your resume:{" "}
          {userSkills.slice(0, 8).join(", ")}
          {userSkills.length > 8 && ` +${userSkills.length - 8} more`}
        </div>
      )}

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs... (e.g. React developer, Python engineer)"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-surface-200 rounded-lg text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((filter) => {
          const isActive = activeFilters.includes(filter);
          return (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                isActive
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-surface-600 border-surface-200 hover:border-surface-300"
              }`}
            >
              {filter}
            </button>
          );
        })}
        {activeFilters.length > 0 && (
          <button
            onClick={() => setActiveFilters([])}
            className="px-3 py-1.5 text-sm font-medium text-surface-500 hover:text-surface-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary-500 mb-3" />
          <p className="text-surface-500 text-sm">Searching for jobs...</p>
        </div>
      ) : error ? (
        <SectionCard className="text-center py-12">
          <AlertTriangle size={40} className="mx-auto text-warning-500 mb-3" />
          <p className="text-surface-700 font-medium mb-1">{error}</p>
          <p className="text-surface-400 text-sm mb-4">
            {error.includes("API key") ? "Add JSEARCH_API_KEY to server .env" : "Try again later"}
          </p>
          <button
            onClick={() => fetchJobs(searchQuery)}
            className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
          >
            Retry
          </button>
        </SectionCard>
      ) : filteredJobs.length === 0 ? (
        <SectionCard className="text-center py-12">
          <Briefcase size={40} className="mx-auto text-surface-300 mb-3" />
          <p className="text-surface-500">No jobs match your search or filters.</p>
        </SectionCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl border border-surface-200 shadow-sm hover:shadow-md transition-shadow p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt="" className="w-10 h-10 rounded-lg object-contain shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold shrink-0">
                      {job.company?.charAt(0) || "C"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-surface-900 truncate">
                      {job.title}
                    </h3>
                    <p className="text-sm text-surface-500">{job.company}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold border shrink-0 ${getMatchColor(job.match)}`}
                >
                  {job.match}%
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-surface-500 mb-3">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} />
                  {job.location || "Remote"}
                </span>
                {job.salary && (
                  <span className="inline-flex items-center gap-1">
                    <DollarSign size={14} />
                    {job.salary}
                  </span>
                )}
                {job.source && (
                  <span className="text-xs text-surface-400">via {job.source}</span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {job.jobSkills.slice(0, 6).map((skill) => (
                  <SkillBadge
                    key={skill}
                    skill={skill}
                    variant={job.matchedSkills.includes(skill) ? "matched" : "missing"}
                    size="sm"
                  />
                ))}
              </div>

              {job.description && (
                <p className="text-sm text-surface-500 line-clamp-2 mb-4">
                  {job.description}
                </p>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Briefcase size={14} />
                  {selectedJob === job.id ? "Hide Details" : "View Job"}
                </button>
                <button
                  onClick={() => toggleSave(job)}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-surface-200 text-surface-500 hover:text-primary-600 hover:border-primary-300 transition-colors"
                >
                  {savedJobs.includes(job.id) ? (
                    <BookmarkCheck size={18} className="text-primary-600" />
                  ) : (
                    <Bookmark size={18} />
                  )}
                </button>
                {job.applyUrl && (
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-surface-200 text-surface-500 hover:text-primary-600 hover:border-primary-300 transition-colors"
                    title="Apply externally"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>

              {selectedJob === job.id && (
                <div className="mt-4 pt-4 border-t border-surface-200 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-surface-900 mb-2">
                      Why you're a {job.match}% match
                    </h4>
                    <ul className="space-y-1.5">
                      {job.matchedSkills.map((skill) => (
                        <li key={skill} className="flex items-center gap-2 text-sm text-success-600">
                          <CheckCircle2 size={14} />
                          {skill} experience
                        </li>
                      ))}
                      {job.missingSkills.map((skill) => (
                        <li key={skill} className="flex items-center gap-2 text-sm text-warning-600">
                          <AlertTriangle size={14} />
                          Missing {skill} experience
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-surface-900 mb-2">What to improve</h4>
                    <ul className="space-y-1.5">
                      {job.missingSkills.map((skill) => (
                        <li key={skill} className="flex items-center gap-2 text-sm text-surface-600">
                          <TrendingUp size={14} className="text-primary-500" />
                          Learn {skill} to improve your match score
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-primary-50 rounded-lg px-4 py-3 text-sm text-primary-700 font-medium">
                    Estimated improvement: {job.match}% → {Math.min(99, job.match + job.missingSkills.length * 3)}%
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobMatches;
