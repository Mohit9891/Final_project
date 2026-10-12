import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import api from "./configs/api";
import { login, setLoading } from "./app/features/authSlice";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Preview from "./pages/Preview";
import AppLayout from "./components/layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import ResumePage from "./pages/ResumePage";
import Analysis from "./pages/Analysis";
import JobMatches from "./pages/JobMatches";
import Applications from "./pages/Applications";
import ResumeBuilder from "./pages/ResumeBuilder";
import JdAnalyzer from "./pages/JdAnalyzer";
import SkillGap from "./pages/SkillGap";
import Assistant from "./pages/Assistant";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

const App = () => {
  const dispatch = useDispatch();

  const getUserData = async () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        const { data } = await api.get("/api/users/data", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.user) {
          dispatch(login({ token, user: data.user }));
        }
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
      }
    } catch {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="view/:resumeId" element={<Preview />} />

        <Route path="app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="jobs" element={<JobMatches />} />
          <Route path="applications" element={<Applications />} />
          <Route path="builder" element={<ResumeBuilder />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
          <Route path="jd-analyzer" element={<JdAnalyzer />} />
          <Route path="skill-gap" element={<SkillGap />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
