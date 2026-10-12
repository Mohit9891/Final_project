import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Loader from "../Loader";

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <Loader />;

  // Redirect to login if not authenticated
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="md:hidden fixed inset-0 z-50">
        {mobileOpen && (
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <div
          className={`absolute top-0 left-0 h-full transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
        </div>
      </div>

      <div className="hidden md:block">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      <div
        className={`transition-all duration-300 ${
          collapsed ? "md:ml-16" : "md:ml-60"
        }`}
      >
        <div className="md:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-white border-b border-surface-200 shadow-sm flex items-center px-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 rounded-lg text-surface-600 hover:bg-surface-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-3 text-lg font-semibold text-surface-900">
            ResumeAI
          </span>
        </div>

        <div className="md:hidden h-14" />

        <main className="min-h-[calc(100vh-3.5rem)] md:min-h-screen">
          <TopBar />
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
