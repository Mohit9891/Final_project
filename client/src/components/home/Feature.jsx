import { Zap } from "lucide-react";
import React from "react";

const Feature = () => {
  return (
    <div
      id="features"
      className="flex flex-col items-center my-10 scroll-mt-12"
    >
      <>
        <div className="flex items-center gap-2 mb-6 text-sm text-green-800 bg-green-400/10 rounded-full px-6 py-1.5">
          <Zap width={14} />
          <span>Simple process</span>
        </div>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
          * { font-family: 'Poppins', sans-serif; }
        `}</style>

        <h1 className="text-3xl font-semibold text-center mx-auto">
          Build your resume
        </h1>
        <p className="text-sm text-slate-500 text-center mt-2 max-w-md mx-auto">
          Our streamlined process helps you create a professional resume in
          minutes with intelligent AI-powered tools and features.
        </p>

        <div className="flex items-center justify-center flex-wrap gap-6 mt-20 px-4 md:px-0">

          {/* Feature 1 — AI Resume Builder */}
          <div className="flex flex-col text-center items-center justify-center rounded-xl p-6 border border-violet-200 gap-6 max-w-sm">
            <div className="p-6 aspect-square bg-violet-100 rounded-full">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2.333A11.667 11.667 0 1 0 25.667 14 11.68 11.68 0 0 0 14 2.333Zm0 4.667a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm0 16.333a8.167 8.167 0 0 1-7-3.976c.035-2.321 4.667-3.591 7-3.591s6.965 1.27 7 3.591a8.167 8.167 0 0 1-7 3.976Z" fill="#7F22FE"/>
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-slate-700">
                AI-Powered Resume Builder
              </h3>
              <p className="text-sm text-slate-600">
                Create a professional resume in minutes with smart AI suggestions tailored to your experience and target role.
              </p>
            </div>
          </div>

          {/* Feature 2 — Upload & Parse */}
          <div className="flex flex-col text-center items-center justify-center rounded-xl p-6 border border-green-200 gap-6 max-w-sm">
            <div className="p-6 aspect-square bg-green-100 rounded-full">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.668 25.666h18.667a2.333 2.333 0 0 0 2.333-2.333V8.166L19.833 2.333H7a2.333 2.333 0 0 0-2.333 2.333v18.667a2.333 2.333 0 0 0 2.333 2.333Z" stroke="#00A63E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.667 2.333V7A2.333 2.333 0 0 0 21 9.333h4.667M9.333 14h9.334M9.333 18.667h9.334M9.333 9.333h2.334" stroke="#00A63E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-slate-700">
                Upload & Auto-Fill
              </h3>
              <p className="text-sm text-slate-600">
                Upload your existing PDF resume and let AI instantly parse and populate all sections — no manual entry needed.
              </p>
            </div>
          </div>

          {/* Feature 3 — Multiple Templates */}
          <div className="flex flex-col text-center items-center justify-center rounded-xl p-6 border border-orange-200 gap-6 max-w-sm">
            <div className="p-6 aspect-square bg-orange-100 rounded-full">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.333 2.333H4.667A2.333 2.333 0 0 0 2.333 4.667v18.666A2.333 2.333 0 0 0 4.667 25.667h18.666a2.333 2.333 0 0 0 2.334-2.334V4.667a2.333 2.333 0 0 0-2.334-2.334Z" stroke="#F54900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.333 9.333h23.334M9.333 25.667V9.333" stroke="#F54900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-slate-700">
                Beautiful Templates
              </h3>
              <p className="text-sm text-slate-600">
                Choose from multiple ATS-friendly templates — Classic, Modern, Minimal — and customize colors to match your style.
              </p>
            </div>
          </div>

        </div>
      </>
    </div>
  );
};

export default Feature;
