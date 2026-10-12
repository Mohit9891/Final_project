import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../app/features/authSlice";
import { Bell, Search, ChevronDown, LogOut, User, Settings } from "lucide-react";

const TopBar = ({ title, subtitle }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-surface-200 shadow-sm flex items-center justify-between px-6">
      <div>
        {title && (
          <h1 className="text-lg font-semibold text-surface-900">{title}</h1>
        )}
        {subtitle && (
          <p className="text-xs text-surface-500">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-56 pl-9 pr-3 py-1.5 text-sm bg-surface-50 border border-surface-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <button className="relative p-2 rounded-lg text-surface-500 hover:bg-surface-100 hover:text-surface-900 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <ChevronDown className="w-4 h-4 text-surface-500 hidden sm:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-surface-200 rounded-xl shadow-lg py-1 animate-fade-in">
              <div className="px-4 py-2 border-b border-surface-100">
                <p className="text-sm font-medium text-surface-900 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-surface-400 truncate">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/app/profile");
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-surface-600 hover:bg-surface-50 transition-colors"
              >
                <User className="w-4 h-4" />
                Profile
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/app/settings");
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-surface-600 hover:bg-surface-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <div className="border-t border-surface-100 mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
