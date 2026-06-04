import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Cpu, FileCheck2, ShieldAlert, Award, Briefcase, Star, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const stats = [
    { label: "Students Registered", count: "12,450+", glow: "text-cyan-400" },
    { label: "Companies Hiring", count: "480+", glow: "text-purple-400" },
    { label: "Placements Achieved", count: "94.5%", glow: "text-emerald-400" },
    { label: "Active Job Listings", count: "1,200+", glow: "text-yellow-400" }
  ];

  const features = [
    {
      title: "AI Resume Scanner",
      desc: "Instant ATS score check, keyword density check, and specific bullet suggestions based on targeted job desc.",
      icon: FileCheck2,
      color: "from-cyan-500 to-blue-600"
    },
    {
      title: "Interactive AI Chatbot",
      desc: "24/7 mock feedback, salary negotiate tips, placement guides, and tailored technical learning guides.",
      icon: Bot,
      color: "from-purple-500 to-indigo-600"
    },
    {
      title: "Mock Interview Drills",
      desc: "Simulate coding interviews or HR assessments. Receive instant performance scores and response suggestions.",
      icon: Cpu,
      color: "from-fuchsia-500 to-pink-600"
    }
  ];

  const workflowSteps = [
    { step: "01", title: "Build Premium Profile", desc: "Sync your education details, projects database, and skills stack." },
    { step: "02", title: "Scan with ATS Engine", desc: "Run your resume against the parser and resolve recommended missing terms." },
    { step: "03", title: "Practice AI Mock Prep", desc: "Drill custom interview rounds in our specialized career chat rooms." },
    { step: "04", title: "Secure Placements", desc: "Apply directly to vetted positions and track recruiter pipeline steps." }
  ];

  const companies = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" }
  ];

  return (
    <div class="min-h-screen bg-[#0A0F1F] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* Floating Landing Header */}
      <header class="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between z-50">
        <div class="flex items-center gap-2">
          <div class="p-1.5 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Cpu class="h-6 w-6 text-white" />
          </div>
          <span class="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            NEXUS<span class="text-cyan-400">AI</span>
          </span>
        </div>
        <div class="flex items-center gap-4">
          <Link to="/login" class="text-xs font-semibold text-slate-300 hover:text-cyan-400 transition">
            Sign In
          </Link>
          <Link 
            to="/register" 
            class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold hover:border-cyan-500/50 hover:text-cyan-400 transition"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section class="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center relative overflow-hidden flex-1 flex flex-col items-center justify-center">
        {/* Soft Background Globs */}
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <div class="absolute bottom-10 left-1/3 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[90px] -z-10 animate-pulse duration-500"></div>

        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-300 text-xs font-semibold mb-6 animate-bounce">
          <Sparkles class="h-3.5 w-3.5" />
          Next-Gen AI Placement System
        </div>

        <h1 class="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight max-w-4xl">
          Supercharge Your Placement Success With
          <span class="block mt-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Autonomous AI Coaching
          </span>
        </h1>

        <p class="text-slate-400 text-sm sm:text-lg max-w-2xl mt-6 leading-relaxed">
          Unlock a tailored placement pathway. Get automated resume ATS updates, practice real-time technical questions, and secure hiring interviews with top tech teams.
        </p>

        {/* Action Buttons */}
        <div class="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
          <Link 
            to="/register" 
            class="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 font-bold text-sm text-white hover:scale-105 transition shadow-lg shadow-purple-500/20"
          >
            Enter Student Portal
            <ArrowRight class="h-4.5 w-4.5" />
          </Link>
          <Link 
            to="/login" 
            class="flex items-center justify-center px-6 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold text-sm hover:border-cyan-400/35 hover:text-cyan-400 transition"
          >
            Access Recruiter Desk
          </Link>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section class="border-y border-slate-900 bg-slate-950/40 py-12">
        <div class="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((st, idx) => (
            <div key={idx} class="space-y-1">
              <h3 class={`text-3xl sm:text-4xl font-extrabold ${st.glow}`}>{st.count}</h3>
              <p class="text-xs text-slate-500 font-medium uppercase tracking-wider">{st.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section class="max-w-7xl mx-auto px-6 py-24 space-y-16">
        <div class="text-center max-w-2xl mx-auto space-y-3">
          <h2 class="text-2xl sm:text-4xl font-bold">Intelligent Platform Capabilities</h2>
          <p class="text-xs sm:text-sm text-slate-400">Everything you need to scale placement preparations and connect directly with hiring teams.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                class="glass-card p-6 rounded-2xl border border-slate-800/80 bg-slate-900/10 hover:border-cyan-500/20 hover:bg-slate-900/30 transition-all duration-300 group"
              >
                <div class={`p-3 rounded-xl bg-gradient-to-tr ${feat.color} w-fit text-white shadow-lg mb-6 group-hover:scale-105 transition`}>
                  <Icon class="h-6 w-6" />
                </div>
                <h3 class="text-lg font-bold text-slate-200">{feat.title}</h3>
                <p class="text-xs text-slate-400 mt-2 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works Timeline */}
      <section class="max-w-7xl mx-auto px-6 py-20 space-y-16 border-t border-slate-900">
        <div class="text-center max-w-xl mx-auto space-y-2">
          <h2 class="text-2xl sm:text-4xl font-bold">Your Success Blueprint</h2>
          <p class="text-xs sm:text-sm text-slate-400">Follow the streamlined pathway from profile setup to final placement.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((ws, idx) => (
            <div 
              key={idx}
              class="p-5 rounded-2xl bg-slate-950/40 border border-slate-900 relative overflow-hidden group"
            >
              <span class="text-4xl font-extrabold text-slate-800/60 block mb-4 group-hover:text-cyan-500/20 transition duration-300">
                {ws.step}
              </span>
              <h4 class="text-sm font-bold text-slate-200">{ws.title}</h4>
              <p class="text-xs text-slate-400 mt-2 leading-relaxed">{ws.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section class="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { quote: "Nexus AI ATS feedback was crucial. After updating my keyword lists, I instantly secured software role interviews at Google.", author: "Alex Carter", role: "Placed at Google" },
            { quote: "Reviewing backend database mock questions with the chatbot helped me build confidence. Highly recommend the mock system!", author: "Ria Sharma", role: "Placed at Amazon" },
            { quote: "Managing applicant resumes became simple. The skill-match indexing saves hours of sourcing and testing filters.", author: "David Chen", role: "Lead Recruiter, Microsoft" }
          ].map((t, idx) => (
            <div key={idx} class="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div class="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} class="h-4 w-4 fill-cyan-400 text-cyan-400" />
                ))}
              </div>
              <p class="text-xs text-slate-300 italic leading-relaxed">"{t.quote}"</p>
              <div class="mt-6">
                <h5 class="text-xs font-bold text-slate-200">{t.author}</h5>
                <p class="text-[10px] text-cyan-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partners List */}
      <section class="py-12 border-t border-slate-900 bg-slate-950/20">
        <div class="max-w-7xl mx-auto px-6 text-center space-y-6">
          <p class="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Empowering Careers at Global Industry Leaders</p>
          <div class="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60">
            {companies.map((c, idx) => (
              <img 
                key={idx} 
                src={c.logo} 
                alt={c.name} 
                class="h-6 md:h-8 hover:opacity-100 transition filter grayscale invert" 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer class="mt-auto py-8 border-t border-slate-900 bg-slate-950 text-center text-xs text-slate-500">
        <p>© 2026 Nexus AI Placement Management Platform. Built for futuristic SaaS efficiency.</p>
      </footer>

    </div>
  );
};

export default LandingPage;
