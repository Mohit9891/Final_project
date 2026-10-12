import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Brain,
  Target,
  Briefcase,
  Upload,
  Lightbulb,
  Trophy,
  Menu,
  X,
  ArrowRight,
  CheckCircle2,
  Star,
  Zap,
} from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-surface-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900">
              ResumeAI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-surface-600 hover:text-primary-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/login"
              className="text-sm font-medium text-surface-600 hover:text-primary-600 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-full hover:bg-primary-700 transition-colors shadow-md shadow-primary-200"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-surface-600 hover:text-surface-900"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-surface-100 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-surface-600 hover:text-primary-600 py-2"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-surface-600 hover:text-primary-600 py-2"
            >
              Login
            </Link>
            <Link
              to="/app"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-full hover:bg-primary-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-100/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 border border-primary-100 rounded-full text-primary-700 text-xs font-semibold mb-6">
              <Zap className="w-3.5 h-3.5" />
              AI-Powered Resume Optimization
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-surface-900 leading-tight tracking-tight">
              Turn your resume into your next{" "}
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                opportunity.
              </span>
            </h1>
            <p className="mt-6 text-lg text-surface-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              AI-powered resume analysis, ATS optimization, and personalized
              job recommendations — all in one place.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/app"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300"
              >
                Analyze My Resume
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-surface-200 text-surface-700 font-semibold rounded-full hover:border-primary-300 hover:text-primary-600 transition-all"
              >
                Explore Jobs
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-sm text-surface-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success-500" />
                Free to start
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success-500" />
                No credit card required
              </div>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-400 to-purple-400 rounded-3xl blur-lg opacity-20" />
              <div className="relative bg-white rounded-2xl shadow-2xl shadow-surface-200/50 border border-surface-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-surface-400 font-medium uppercase tracking-wider">
                      ATS Score
                    </p>
                    <p className="text-3xl font-bold text-surface-900 mt-1">
                      82<span className="text-lg text-surface-400">/100</span>
                    </p>
                  </div>
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="6"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        fill="none"
                        stroke="url(#scoreGradient)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray="213.6"
                        strokeDashoffset="38.4"
                      />
                      <defs>
                        <linearGradient
                          id="scoreGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-600">
                        82%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <p className="text-xs font-semibold text-surface-500 mb-2.5 uppercase tracking-wider">
                    Top Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "React",
                      "Node.js",
                      "TypeScript",
                      "Python",
                      "AWS",
                      "Docker",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full border border-primary-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
                    Matched Jobs
                  </p>
                  {[
                    {
                      title: "Senior Frontend Engineer",
                      company: "TechCorp",
                      match: "94%",
                    },
                    {
                      title: "Full Stack Developer",
                      company: "StartupXYZ",
                      match: "88%",
                    },
                  ].map((job) => (
                    <div
                      key={job.title}
                      className="flex items-center justify-between p-3 bg-surface-50 rounded-xl border border-surface-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-surface-800">
                            {job.title}
                          </p>
                          <p className="text-xs text-surface-400">
                            {job.company}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-success-600 bg-success-50 px-2.5 py-1 rounded-full">
                        {job.match} match
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Resume Analysis",
      description:
        "Get instant AI-powered feedback on your resume's content, structure, and ATS compatibility.",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: Target,
      title: "Skill Gap Analysis",
      description:
        "Discover missing skills and keywords that could boost your resume's ranking.",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      icon: Briefcase,
      title: "Job Matching",
      description:
        "Get matched with relevant job opportunities based on your skills and experience.",
      gradient: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-900">
            Everything you need to land your dream job
          </h2>
          <p className="mt-4 text-lg text-surface-500">
            Powerful tools to analyze, optimize, and supercharge your job search.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative p-8 bg-white rounded-2xl border border-surface-100 hover:border-surface-200 hover:shadow-xl hover:shadow-surface-100 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-surface-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-surface-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Resume",
      description: "Upload your existing resume in PDF or DOCX format.",
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description:
        "Our AI scans your resume for content, keywords, and ATS compatibility.",
    },
    {
      icon: Lightbulb,
      title: "Get Insights",
      description:
        "Receive actionable feedback, score breakdowns, and improvement tips.",
    },
    {
      icon: Trophy,
      title: "Get Hired",
      description:
        "Apply with confidence and land interviews at top companies.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
            How it Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-900">
            Four steps to your next role
          </h2>
          <p className="mt-4 text-lg text-surface-500">
            A simple, guided process from upload to offer.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative text-center">
                  <div className="relative inline-flex mb-6">
                    <div className="w-24 h-24 bg-white rounded-2xl shadow-md border border-surface-100 flex items-center justify-center relative z-10">
                      <Icon className="w-10 h-10 text-primary-600" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg z-20">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-surface-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-surface-500 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 p-12 sm:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to optimize your resume?
            </h2>
            <p className="text-lg text-primary-100 mb-8 max-w-xl mx-auto">
              Join thousands of job seekers who have improved their resume scores
              and landed more interviews.
            </p>
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-full hover:bg-primary-50 transition-colors shadow-xl"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-surface-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ResumeAI</span>
          </Link>

          <div className="flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-surface-400 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-surface-400 hover:text-white transition-colors"
            >
              How it Works
            </a>
            <Link
              to="/login"
              className="text-sm text-surface-400 hover:text-white transition-colors"
            >
              Login
            </Link>
          </div>

          <p className="text-sm text-surface-500">
            &copy; {new Date().getFullYear()} ResumeAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Landing;
