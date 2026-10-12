import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MapPin, Phone, Mail, Plus, X } from "lucide-react";
import SkillBadge from "../components/ui/SkillBadge";
import SectionCard from "../components/ui/SectionCard";

const experienceLevels = ["Student/Fresher", "1-3 years", "3-5 years", "5+ years"];
const targetRoleOptions = ["Software Engineer", "Senior Software Engineer", "Tech Lead", "Full Stack Developer", "Product Manager"];

const mockResumes = [
  { id: 1, name: "Software Engineer Resume", date: "2026-09-10", status: "complete" },
  { id: 2, name: "Frontend Developer Resume", date: "2026-09-05", status: "draft" },
];

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [location, setLocation] = useState("Bangalore");
  const [targetRole, setTargetRole] = useState("Senior Software Engineer");
  const [experience, setExperience] = useState("1-3 years");
  const [skills, setSkills] = useState(["JavaScript", "React", "Node.js", "TypeScript", "Git"]);
  const [locations, setLocations] = useState(["Bangalore", "Delhi NCR", "Hyderabad"]);
  const [newLocation, setNewLocation] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    jobAlerts: true,
    resumeTips: false,
    weeklyDigest: true,
  });

  const addLocation = () => {
    if (newLocation.trim() && !locations.includes(newLocation.trim())) {
      setLocations((prev) => [...prev, newLocation.trim()]);
      setNewLocation("");
    }
  };

  const removeLocation = (loc) => {
    setLocations((prev) => prev.filter((l) => l !== loc));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills((prev) => [...prev, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-surface-900">Profile</h1>
        <p className="text-sm text-surface-500 mt-1">Manage your personal information and preferences.</p>
      </div>

      <SectionCard className="mb-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-primary-500 text-white flex items-center justify-center text-3xl font-bold shrink-0">
            {name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-surface-900">{name || "User"}</h2>
            <p className="text-sm text-surface-500">{email}</p>
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Personal Information">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Full Name</label>
              <div className="relative">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm"
                  placeholder="Your name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Phone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm"
                  placeholder="+91 00000 00000"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Location</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm"
                  placeholder="City"
                />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Career Preferences">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Target Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-transparent"
              >
                {targetRoleOptions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Experience Level</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-transparent"
              >
                {experienceLevels.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Preferred Locations</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {locations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-primary-50 text-primary-700 rounded-full"
                  >
                    {loc}
                    <button onClick={() => removeLocation(loc)} className="hover:text-primary-900">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addLocation()}
                  className="flex-1 px-3 py-2 text-sm"
                  placeholder="Add location"
                />
                <button
                  onClick={addLocation}
                  className="px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Skills" subtitle={`${skills.length} skills added`}>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1.5">
                  <SkillBadge skill={skill} />
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-surface-400 hover:text-danger-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                className="flex-1 px-3 py-2 text-sm"
                placeholder="Add a skill"
              />
              <button
                onClick={addSkill}
                className="px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Resume Versions">
          <div className="space-y-3">
            {mockResumes.map((resume) => (
              <div key={resume.id} className="flex items-center justify-between p-3 rounded-lg border border-surface-200 hover:border-surface-300 transition-colors">
                <div>
                  <h4 className="text-sm font-medium text-surface-900">{resume.name}</h4>
                  <p className="text-xs text-surface-400 mt-0.5">Updated {new Date(resume.date).toLocaleDateString()}</p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    resume.status === "complete"
                      ? "bg-success-50 text-success-600"
                      : "bg-warning-50 text-warning-600"
                  }`}
                >
                  {resume.status === "complete" ? "Complete" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Notification Preferences" className="lg:col-span-2">
          <div className="space-y-4">
            {[
              { key: "emailAlerts", label: "Email Notifications", desc: "Receive updates about your account via email" },
              { key: "jobAlerts", label: "Job Alerts", desc: "Get notified about new job matches" },
              { key: "resumeTips", label: "Resume Tips", desc: "Weekly tips to improve your resume" },
              { key: "weeklyDigest", label: "Weekly Digest", desc: "Summary of your activity and suggestions" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-sm font-medium text-surface-900">{item.label}</h4>
                  <p className="text-xs text-surface-500 mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() =>
                    setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    notifications[item.key] ? "bg-primary-600" : "bg-surface-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      notifications[item.key] ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;
