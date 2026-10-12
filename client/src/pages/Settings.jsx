import React, { useState } from "react";
import { User, Shield, Bell, Eye, Camera, Trash2 } from "lucide-react";
import SectionCard from "../components/ui/SectionCard";

const tabs = [
  { id: "account", label: "Account", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Eye },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    jobAlerts: true,
    resumeTips: false,
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    dataSharing: false,
  });

  const toggleNotif = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePrivacy = (key) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-surface-900">Settings</h1>
        <p className="text-sm text-surface-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-56 shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary-50 text-primary-600"
                    : "text-surface-600 hover:bg-surface-100"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {activeTab === "account" && (
            <div className="space-y-6">
              <SectionCard title="Profile Picture">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-full bg-primary-500 text-white flex items-center justify-center text-3xl font-bold shrink-0">
                    {name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                      <Camera size={16} />
                      Change Photo
                    </button>
                    <p className="text-xs text-surface-400 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Account Information">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">Full Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">Email Address</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm"
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Danger Zone" className="border-danger-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-surface-900">Delete Account</h4>
                    <p className="text-xs text-surface-500 mt-0.5">Permanently delete your account and all associated data.</p>
                  </div>
                  <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-danger-600 bg-danger-50 rounded-lg hover:bg-danger-100 transition-colors">
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </SectionCard>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <SectionCard title="Change Password">
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <button className="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
                    Update Password
                  </button>
                </div>
              </SectionCard>

              <SectionCard title="Two-Factor Authentication">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-surface-900">Enable 2FA</h4>
                    <p className="text-xs text-surface-500 mt-0.5">Add an extra layer of security to your account.</p>
                  </div>
                  <button
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      twoFactor ? "bg-primary-600" : "bg-surface-300"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        twoFactor ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>
              </SectionCard>
            </div>
          )}

          {activeTab === "notifications" && (
            <SectionCard title="Notification Preferences">
              <div className="space-y-5">
                {[
                  { key: "email", label: "Email Notifications", desc: "Receive account and activity updates via email" },
                  { key: "jobAlerts", label: "Job Alerts", desc: "Get notified when new jobs match your profile" },
                  { key: "resumeTips", label: "Resume Improvement Tips", desc: "Weekly suggestions to strengthen your resume" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="text-sm font-medium text-surface-900">{item.label}</h4>
                      <p className="text-xs text-surface-500 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => toggleNotif(item.key)}
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
          )}

          {activeTab === "privacy" && (
            <div className="space-y-6">
              <SectionCard title="Profile Visibility">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-surface-900">Public Profile</h4>
                    <p className="text-xs text-surface-500 mt-0.5">Allow recruiters to find your profile.</p>
                  </div>
                  <button
                    onClick={() => togglePrivacy("profileVisible")}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      privacy.profileVisible ? "bg-primary-600" : "bg-surface-300"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        privacy.profileVisible ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>
              </SectionCard>

              <SectionCard title="Data Sharing">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-surface-900">Anonymous Data Sharing</h4>
                    <p className="text-xs text-surface-500 mt-0.5">Help improve our service by sharing anonymized usage data.</p>
                  </div>
                  <button
                    onClick={() => togglePrivacy("dataSharing")}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      privacy.dataSharing ? "bg-primary-600" : "bg-surface-300"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        privacy.dataSharing ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>
              </SectionCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
