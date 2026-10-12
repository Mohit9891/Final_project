import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../app/features/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../configs/api";
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  SearchCheck,
  Briefcase,
  Send,
  Hammer,
  FileSearch,
  Layers,
  Bot,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

const navSections = [
  {
    label: "Overview",
    items: [
      { to: "/app", icon: LayoutDashboard, label: "Dashboard", end: true },
      { to: "/app/resume", icon: FileText, label: "Resume" },
      { to: "/app/analysis", icon: SearchCheck, label: "Resume Analysis" },
      { to: "/app/jobs", icon: Briefcase, label: "Job Matches" },
      { to: "/app/applications", icon: Send, label: "Applications" },
    ],
  },
  {
    label: "Tools",
    items: [
      { action: "new-resume", to: "/app/builder", icon: Hammer, label: "Resume Builder" },
      { to: "/app/jd-analyzer", icon: FileSearch, label: "JD Analyzer" },
      { to: "/app/skill-gap", icon: Layers, label: "Skill Gap" },
      { to: "/app/assistant", icon: Bot, label: "AI Assistant" },
    ],
  },
  {
    label: "Account",
    items: [
      { to: "/app/profile", icon: User, label: "Profile" },
      { to: "/app/settings", icon: Settings, label: "Settings" },
    ],
  },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const isActive = (path, end) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const createAndOpenBuilder = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(
        "/api/resumes/create",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (data?.resume?._id) navigate(`/app/builder/${data.resume._id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not create resume");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-surface-200 z-40 flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="flex items-center gap-2 px-4 h-16 border-b border-surface-200 shrink-0">
        <Sparkles className="w-6 h-6 text-primary-500 shrink-0" />
        {!collapsed && (
          <span className="text-lg font-bold text-surface-900 whitespace-nowrap">
            ResumeAI
          </span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {navSections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="px-3 mb-2 text-xs font-semibold text-surface-400 uppercase tracking-wider">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.to, item.end);
                const linkClass = `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary-50 text-primary-600 border-l-2 border-primary-600"
                    : "text-surface-600 hover:bg-surface-100 hover:text-surface-900"
                }`;
                const icon = (
                  <>
                    <item.icon className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </>
                );

                if (item.action === "new-resume") {
                  return (
                    <button
                      key={item.to}
                      type="button"
                      title={collapsed ? item.label : undefined}
                      onClick={createAndOpenBuilder}
                      className={`${linkClass} w-full text-left`}
                    >
                      {icon}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    title={collapsed ? item.label : undefined}
                    className={linkClass}
                  >
                    {icon}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-surface-200 p-3">
        <div
          className={`flex items-center gap-3 px-2 py-2 rounded-lg ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-semibold shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-900 truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-surface-400 truncate">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-surface-400 hover:text-danger-600 hover:bg-danger-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
        {collapsed && (
          <button
            onClick={handleLogout}
            className="w-full mt-2 p-1.5 rounded-lg text-surface-400 hover:text-danger-600 hover:bg-danger-50 transition-colors flex justify-center"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>

      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-surface-200 rounded-full flex items-center justify-center text-surface-500 hover:text-surface-900 hover:bg-surface-50 shadow-sm transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
