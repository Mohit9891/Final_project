import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MapPin, Calendar, MoreVertical, Trash2, ArrowRight } from "lucide-react";
import api from "../configs/api";
import toast from "react-hot-toast";
import SectionCard from "../components/ui/SectionCard";

const columns = [
  { id: "saved", title: "Saved", color: "border-surface-400", badge: "bg-surface-100 text-surface-600" },
  { id: "applied", title: "Applied", color: "border-blue-500", badge: "bg-blue-50 text-blue-600" },
  { id: "oa", title: "Online Assessment", color: "border-orange-500", badge: "bg-orange-50 text-orange-600" },
  { id: "interview", title: "Interview", color: "border-purple-500", badge: "bg-purple-50 text-purple-600" },
  { id: "offer", title: "Offer", color: "border-green-500", badge: "bg-green-50 text-green-600" },
];

const Applications = () => {
  const { token } = useSelector((state) => state.auth);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const { data } = await api.get("/api/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(data.applications || []);
    } catch (error) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [token]);

  const updateStatus = async (applicationId, newStatus) => {
    try {
      await api.put(
        `/api/applications/${applicationId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app))
      );
      toast.success("Status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deleteApplication = async (applicationId) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await api.delete(`/api/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications((prev) => prev.filter((app) => app._id !== applicationId));
      toast.success("Application deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const grouped = columns.map((col) => ({
    ...col,
    items: applications.filter((app) => app.status === col.id),
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-surface-900">Application Tracker</h1>
        <p className="text-sm text-surface-500 mt-1">
          Track your job applications from start to finish.
        </p>
      </div>

      <SectionCard className="overflow-hidden">
        <div className="overflow-x-auto -m-6 p-6">
          <div className="flex gap-4 min-w-max pb-2">
            {grouped.map((col) => (
              <div key={col.id} className="w-72 shrink-0">
                <div className={`rounded-xl bg-surface-50 border-t-2 ${col.color}`}>
                  <div className="flex items-center justify-between px-4 py-3">
                    <h3 className="text-sm font-semibold text-surface-700">{col.title}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${col.badge}`}>
                      {col.items.length}
                    </span>
                  </div>

                  <div className="px-4 pb-4 space-y-3 max-h-[500px] overflow-y-auto">
                    {col.items.length === 0 ? (
                      <p className="text-center text-surface-400 text-sm py-8">No applications</p>
                    ) : (
                      col.items.map((app) => (
                        <div
                          key={app._id}
                          className="bg-white rounded-lg border border-surface-200 p-3 shadow-sm"
                        >
                          <div className="flex items-start justify-between">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                                  style={{ backgroundColor: app.companyLogo || "#3B82F6" }}
                                >
                                  {app.company?.charAt(0) || "C"}
                                </div>
                                <h4 className="text-sm font-medium text-surface-900 truncate">
                                  {app.jobTitle}
                                </h4>
                              </div>
                              <p className="text-xs text-surface-500 truncate">{app.company}</p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-surface-400">
                                <MapPin size={12} />
                                <span>{app.location}</span>
                                <Calendar size={12} />
                                <span>
                                  {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                // TODO: show dropdown with status options
                              }}
                              className="p-1 text-surface-400 hover:text-surface-600"
                            >
                              <MoreVertical size={16} />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <select
                              value={app.status}
                              onChange={(e) => updateStatus(app._id, e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border border-surface-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              {columns.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.title}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => deleteApplication(app._id)}
                              className="p-1.5 text-surface-400 hover:text-danger-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {app.applyUrl && (
                            <a
                              href={app.applyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 mt-2"
                            >
                              <ArrowRight size={12} />
                              View Listing
                            </a>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default Applications;
