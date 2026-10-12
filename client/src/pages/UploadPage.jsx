import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { UploadCloud, FileText, X, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import api from "../configs/api";
import StepProgress from "../components/ui/StepProgress";
import extractTextFromPDF from "../utils/pdfExtract";

const analysisSteps = [
  { label: "Extracting resume information", status: "done" },
  { label: "Understanding experience", status: "done" },
  { label: "Evaluating ATS compatibility", status: "active" },
  { label: "Identifying missing skills", status: "pending" },
  { label: "Finding relevant jobs", status: "pending" },
];

const UploadPage = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [steps, setSteps] = useState(analysisSteps);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateFile = (f) => {
    if (f.type !== "application/pdf") {
      toast.error("Only PDF files are accepted");
      return false;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5 MB");
      return false;
    }
    return true;
  };

  const handleFile = useCallback((f) => {
    if (f && validateFile(f)) {
      setFile(f);
      toast.success(`${f.name} ready for analysis`);
    }
  }, []);

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    handleFile(dropped);
  };

  const onFileSelect = (e) => {
    const selected = e.target.files[0];
    handleFile(selected);
  };

  const simulateAnalysis = async () => {
    const stepDurations = [800, 1200, 1600, 1000, 800];
    const statuses = ["done", "done", "done", "done", "done"];

    for (let i = 0; i < statuses.length; i++) {
      await new Promise((r) => setTimeout(r, stepDurations[i]));
      setSteps((prev) =>
        prev.map((s, idx) => {
          if (idx < i) return { ...s, status: "done" };
          if (idx === i) return { ...s, status: i === statuses.length - 1 ? "done" : "active" };
          return s;
        })
      );
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please upload a resume first");
      return;
    }

    setIsAnalyzing(true);
    setSteps(analysisSteps);

    try {
      const resumeText = await extractTextFromPDF(file);

      await api.post(
        "/api/ai/upload-resume",
        { title: file.name.replace(".pdf", ""), resumeText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await simulateAnalysis();

      toast.success("Analysis complete!");
      navigate("/app");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-surface-900">
          Let's analyze your resume
        </h1>
        <p className="text-surface-500 text-lg">
          Upload your resume and get an AI-powered career health report in seconds.
        </p>
      </div>

      {!file && (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200
            ${isDragging
              ? "border-primary-500 bg-primary-50/50 shadow-lg shadow-primary-100"
              : "border-surface-300 bg-white hover:border-primary-400 hover:bg-primary-50/30"
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={onFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-4">
            <div className={`
              inline-flex items-center justify-center w-16 h-16 rounded-2xl transition-colors duration-200
              ${isDragging ? "bg-primary-100 text-primary-600" : "bg-surface-100 text-surface-400"}
            `}>
              <UploadCloud size={32} />
            </div>

            <div className="space-y-1">
              <p className="text-lg font-semibold text-surface-900">
                Drop your PDF here
              </p>
              <p className="text-surface-500">
                or <span className="text-primary-600 font-medium hover:underline">Browse files</span>
              </p>
            </div>

            <p className="text-xs text-surface-400">PDF only · Max 5 MB</p>
          </div>
        </div>
      )}

      {file && !isAnalyzing && (
        <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600">
              <FileText size={24} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-surface-900 truncate">{file.name}</p>
              <p className="text-sm text-surface-500">{formatFileSize(file.size)}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-success-50 text-success-600">
                <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
                Ready
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="p-1.5 rounded-lg text-surface-400 hover:text-danger-600 hover:bg-danger-50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {isAnalyzing && (
        <div className="bg-white rounded-2xl border border-surface-200 p-8 shadow-sm space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-50">
              <Loader2 size={24} className="text-primary-600 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-surface-900">Analyzing your resume</h3>
            <p className="text-sm text-surface-500">This usually takes 5–10 seconds</p>
          </div>

          <div className="overflow-x-auto">
            <StepProgress steps={steps} />
          </div>
        </div>
      )}

      {!isAnalyzing && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleAnalyze}
            disabled={!file}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary-200"
          >
            Analyze Resume
            <ArrowRight size={18} />
          </button>

          <div className="flex items-center gap-1.5 text-xs text-surface-400">
            <ShieldCheck size={14} />
            <span>Your resume is processed securely and never shared.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
