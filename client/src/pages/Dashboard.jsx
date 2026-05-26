import {
  FilePenIcon,
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  PencilIcon,
  XIcon,
  LoaderCircleIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configs/api.js";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const colors = ["#9333ea", "#d99660", "#dc2626", "#0284c7", "#16a34a"];

  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  /* ------------------ LOAD ------------------ */
  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/api/users/resumes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllResumes(data.resumes);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  /* ------------------ CREATE ------------------ */
  const createResume = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setAllResumes((prev) => [...prev, data.resume]);
      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  /* ------------------ UPLOAD ------------------ */
  const uploadResume = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("resume =", resume);
      console.log("pdfToText =", pdfToText);

      if (!resume) {
        toast.error("No file selected");
        setIsLoading(false);
        return;
      }

      const resumeText = await pdfToText.default(resume);

      console.log("resumeText =", resumeText?.slice(0, 200));

      const { data } = await api.post(
        "/api/ai/upload-resume",
        { title, resumeText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTitle("");
      setResume(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      console.error("UPLOAD ERROR =", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------ EDIT ------------------ */
  const editTitle = async (event) => {
    event.preventDefault();

    try {
      const { data } = await api.put(
        "/api/resumes/update",
        {
          resumeId: editResumeId,
          resumeData: { title },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAllResumes((prev) =>
        prev.map((resume) =>
          resume._id === editResumeId
            ? { ...resume, title, updatedAt: new Date().toISOString() }
            : resume,
        ),
      );

      setTitle("");
      setEditResumeId("");
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  /* ------------------ DELETE ------------------ */
  const deleteResume = async (resumeId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this resume?"))
        return;

      const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllResumes((prev) => prev.filter((resume) => resume._id !== resumeId));

      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent hidden sm:block">
        Welcome, {user?.name || "User"}
      </p>

      {/* CREATE / UPLOAD */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowCreateResume(true)}
          className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 hover:border-indigo-500 hover:shadow-lg transition"
        >
          <PlusIcon className="size-11 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />
          <p>Create Resume</p>
        </button>

        <button
          onClick={() => setShowUploadResume(true)}
          className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 hover:border-purple-500 hover:shadow-lg transition"
        >
          <UploadCloudIcon className="size-11 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full" />
          <p>Upload Existing</p>
        </button>
      </div>

      <hr className="border-slate-300 my-6 sm:w-[305px]" />

      {/* RESUME CARDS */}
      <div className="flex flex-wrap gap-4">
        {allResumes.map((resume, index) => {
          const baseColor = colors[index % colors.length];

          return (
            <button
              key={resume._id}
              onClick={() => navigate(`/app/builder/${resume._id}`)}
              className="group relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border hover:shadow-lg transition"
              style={{
                background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                borderColor: baseColor + "40",
              }}
            >
              <FilePenIcon style={{ color: baseColor }} />
              <p className="text-sm text-center">{resume.title}</p>
              <p
                className="absolute bottom-2 text-[11px]"
                style={{ color: baseColor + "90" }}
              >
                Updated on {new Date(resume.updatedAt).toLocaleDateString()}
              </p>

              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-1 right-1 hidden group-hover:flex"
              >
                <TrashIcon
                  onClick={() => deleteResume(resume._id)}
                  className="size-7 p-1.5 hover:bg-white/50 rounded"
                />
                <PencilIcon
                  onClick={() => {
                    setEditResumeId(resume._id);
                    setTitle(resume.title);
                  }}
                  className="size-7 p-1.5 hover:bg-white/50 rounded"
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* CREATE MODAL */}
      {showCreateResume && (
        <form
          onSubmit={createResume}
          className="fixed inset-0 bg-black/70 z-10 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg p-6 w-full max-w-sm relative"
          >
            <h2 className="text-xl font-bold mb-4">Create Resume</h2>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-4 py-2 mb-4"
              placeholder="Resume title"
            />
            <button className="w-full bg-green-600 text-white py-2 rounded">
              Create
            </button>
            <XIcon
              onClick={() => {
                setShowCreateResume(false);
                setTitle("");
              }}
              className="absolute top-4 right-4 cursor-pointer"
            />
          </div>
        </form>
      )}

      {/* UPLOAD MODAL */}
      {showUploadResume && (
        <form
          onSubmit={uploadResume}
          className="fixed inset-0 bg-black/70 z-10 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg p-6 w-full max-w-sm relative"
          >
            <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
            {/* ✅ ADD THIS RIGHT AFTER THE h2 */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-4 py-2 mb-4"
              placeholder="Resume title"
              required
            />

            <div
              onClick={() => document.getElementById("resumeUpload").click()}
              className="border border-dashed p-6 text-center cursor-pointer"
            >
              {resume ? resume.name : "Upload PDF"}
            </div>

            <input
              id="resumeUpload"
              type="file"
              accept=".pdf"
              hidden
              onChange={(e) => setResume(e.target.files[0])}
            />

            <button
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 rounded mt-4 disabled:opacity-50"
            >
              {isLoading && (
                <LoaderCircleIcon className="animate-spin size-4 text-white" />
              )}
              {isLoading ? "Uploading..." : "Upload"}
            </button>

            <XIcon
              onClick={() => {
                setShowUploadResume(false);
                setTitle("");
                setResume(null);
              }}
              className="absolute top-4 right-4 cursor-pointer"
            />
          </div>
        </form>
      )}

      {/* EDIT MODAL */}
      {editResumeId && (
        <form
          onSubmit={editTitle}
          className="fixed inset-0 bg-black/70 z-10 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg p-6 w-full max-w-sm relative"
          >
            <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-4 py-2 mb-4"
            />
            <button className="w-full bg-green-600 text-white py-2 rounded">
              Update
            </button>
            <XIcon
              onClick={() => {
                setEditResumeId("");
                setTitle("");
              }}
              className="absolute top-4 right-4 cursor-pointer"
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default Dashboard;
