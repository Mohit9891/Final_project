import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Plus, FileText, Pencil, Download, Trash2 } from "lucide-react";
import api from "../configs/api";
import SectionCard from "../components/ui/SectionCard";
import EmptyState from "../components/ui/EmptyState";

const statusStyles = {
  draft: "bg-warning-50 text-warning-600",
  complete: "bg-success-50 text-success-600",
};

const ResumePage = () => {
  const { token } = useSelector((state) => state.auth);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResumes = async () => {
      try {
        const { data } = await api.get("/api/users/resumes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResumes(data.resumes || []);
      } catch (error) {
        console.error("Failed to load resumes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) loadResumes();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await api.delete(`/api/resumes/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      console.error("Failed to delete resume:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-surface-900">My Resumes</h1>
          <p className="text-sm text-surface-500 mt-1">Manage and organize all your resumes in one place.</p>
        </div>
        <Link
          to="/app/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shrink-0"
        >
          <Plus size={18} />
          Upload New Resume
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-surface-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <SectionCard>
          <EmptyState
            icon={FileText}
            title="No resumes yet"
            description="Upload an existing resume or create a new one to get started."
            action={{
              label: "Upload Resume",
              onClick: () => (window.location.href = "/app/upload"),
            }}
          />
        </SectionCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <SectionCard key={resume._id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                    <FileText size={20} className="text-primary-600" />
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      statusStyles[resume.status] || statusStyles.draft
                    }`}
                  >
                    {resume.status === "complete" ? "Complete" : "Draft"}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-surface-900 mb-1 line-clamp-1">
                  {resume.title}
                </h3>
                <p className="text-xs text-surface-400 mb-1">
                  Template: {resume.template || "Default"}
                </p>
                <p className="text-xs text-surface-400 mb-4">
                  Updated {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-surface-100">
                  <Link
                    to={`/app/builder/${resume._id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <Pencil size={14} />
                    Edit
                  </Link>
                  <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-surface-600 bg-surface-100 rounded-lg hover:bg-surface-200 transition-colors">
                    <Download size={14} />
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(resume._id)}
                    className="inline-flex items-center justify-center p-2 text-xs text-surface-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumePage;
