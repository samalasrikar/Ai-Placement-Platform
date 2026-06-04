import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api, { handleApiCall, mockData } from '../../services/api';
import { Briefcase, Calendar, CheckSquare, Sparkles, Star, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const result = await handleApiCall(
        () => api.get('/student/dashboard'),
        mockData.student
      );
      setData(result);
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div class="h-96 flex items-center justify-center">
        <div class="h-10 w-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const student = data?.student || mockData.student.student;
  const recentApps = data?.recentApplications || mockData.student.recentApplications;
  const upcomingInterviews = data?.upcomingInterviews || mockData.student.upcomingInterviews;
  const recommendedJobs = data?.recommendedJobs || mockData.student.recommendedJobs;
  const completeness = data?.profileCompletion || mockData.student.profileCompletion;

  return (
    <div class="space-y-6">
      
      {/* Welcome & AI Highlights Grid */}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Welcome Card */}
        <div class="lg:col-span-2 rounded-2xl border border-slate-800 bg-gradient-to-tr from-slate-950 via-slate-900 to-[#121B35] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div class="absolute -right-16 -top-16 w-44 h-44 bg-cyan-500/10 rounded-full blur-2xl"></div>
          
          <div class="space-y-2 relative">
            <div class="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] w-fit font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles class="h-3 w-3 animate-spin" /> Placement Ready
            </div>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-100">Welcome Back, {student.full_name}!</h2>
            <p class="text-xs text-slate-400 max-w-md leading-relaxed">
              Your profile score is at {completeness}%. Keep it above 90% and upload an ATS-scanned resume to boost recruiter matching rates.
            </p>
          </div>

          <div class="flex items-center gap-4 mt-6">
            <Link 
              to="/resume-analyzer" 
              class="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-xs text-white shadow-lg shadow-cyan-500/10 hover:scale-102 transition"
            >
              Analyze Resume
            </Link>
            <Link 
              to="/chatbot" 
              class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:text-cyan-400 transition"
            >
              Ask Career Coach
            </Link>
          </div>
        </div>

        {/* Profile Completion Dial Card */}
        <div class="glass-card rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center text-center">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Profile Completeness</h3>
          <div class="relative flex items-center justify-center w-28 h-28 mb-3">
            {/* SVG Progress Circle */}
            <svg class="w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="48" stroke="#1E293B" stroke-width="8" fill="transparent" />
              <circle 
                cx="56" 
                cy="56" 
                r="48" 
                stroke="url(#cyan-purple)" 
                stroke-width="8" 
                fill="transparent" 
                stroke-dasharray="301.6" 
                stroke-dashoffset={301.6 - (301.6 * completeness) / 100} 
                stroke-linecap="round"
              />
              <defs>
                <linearGradient id="cyan-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#00D4FF" />
                  <stop offset="100%" stop-color="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            <div class="absolute text-center">
              <span class="text-xl font-extrabold text-slate-100">{completeness}%</span>
              <p class="text-[9px] text-slate-400">Complete</p>
            </div>
          </div>
          <Link to="/profile" class="text-xs text-cyan-400 font-semibold hover:underline">Complete profile segments</Link>
        </div>

      </div>

      {/* Main Core Widgets */}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recommended Jobs (Left Col, span 2) */}
        <div class="lg:col-span-2 space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Briefcase class="h-4.5 w-4.5 text-cyan-400" /> Recommended for you
            </h3>
            <Link to="/jobs" class="text-xs text-cyan-400 hover:underline">Browse all vacancies</Link>
          </div>

          <div class="space-y-3">
            {recommendedJobs.map((job) => (
              <div 
                key={job.id} 
                class="glass-card glass-card-hover p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4"
              >
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center p-1 overflow-hidden shrink-0">
                    <img src={job.logo_url} alt={job.company_name} class="h-full object-contain filter invert" />
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-200">{job.title}</h4>
                    <p class="text-[10px] text-slate-400 mt-0.5">{job.company_name} • {job.location}</p>
                  </div>
                </div>

                <div class="flex items-center gap-4 text-right">
                  <div>
                    <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-[10px] font-bold">
                      <TrendingUp class="h-3 w-3" /> {job.matchPercentage}% match
                    </div>
                    <p class="text-[10px] text-slate-400 mt-1">{job.salary}</p>
                  </div>
                  <Link 
                    to={`/jobs/${job.id}`} 
                    class="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition"
                  >
                    <ArrowUpRight class="h-4.5 w-4.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interviews & Applications Tracker (Right Col) */}
        <div class="space-y-6">
          
          {/* Upcoming Interview Widget */}
          <div class="space-y-3">
            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Calendar class="h-4.5 w-4.5 text-purple-400" /> Upcoming Interviews
            </h3>
            
            {upcomingInterviews.length === 0 ? (
              <div class="glass-card p-4 rounded-xl border border-slate-800 text-center py-6 text-xs text-slate-500">
                No interview sessions scheduled.
              </div>
            ) : (
              upcomingInterviews.map((meet) => (
                <div key={meet.id} class="glass-card p-4 rounded-xl border border-slate-800/80 bg-purple-500/5 space-y-3">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="text-xs font-bold text-slate-200">{meet.job_title}</h4>
                      <p class="text-[10px] text-slate-400 mt-0.5">{meet.company_name}</p>
                    </div>
                    <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/25 border border-purple-500/30 text-purple-300 font-bold capitalize">
                      {meet.status}
                    </span>
                  </div>
                  <div class="text-[10px] text-slate-300 leading-relaxed border-t border-slate-850 pt-2">
                    <span class="font-semibold block mb-0.5 text-slate-400">Date & Location:</span>
                    {new Date(meet.schedule_time).toLocaleString()}
                  </div>
                  {meet.meeting_link && (
                    <a 
                      href={meet.meeting_link} 
                      target="_blank" 
                      rel="noreferrer"
                      class="block text-center text-[10px] font-bold py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-102 transition text-white"
                    >
                      Join Meeting Link
                    </a>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Recent Applications Track */}
          <div class="space-y-3">
            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <CheckSquare class="h-4.5 w-4.5 text-emerald-400" /> Applications Tracker
            </h3>

            <div class="space-y-2">
              {recentApps.map((app) => (
                <div key={app.id} class="glass-card p-3 rounded-xl border border-slate-850 flex justify-between items-center text-xs">
                  <div>
                    <span class="font-bold text-slate-200 block truncate max-w-[140px]">{app.job_title}</span>
                    <span class="text-[9px] text-slate-500 mt-0.5 block">{app.company_name}</span>
                  </div>
                  
                  {/* Status Indicator */}
                  <span class={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    app.status === 'selected' ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400' :
                    app.status === 'interview_scheduled' ? 'bg-purple-500/10 border border-purple-500/25 text-purple-400' :
                    app.status === 'rejected' ? 'bg-red-500/10 border border-red-500/25 text-red-400' :
                    'bg-cyan-500/10 border border-cyan-500/25 text-cyan-400'
                  }`}>
                    {app.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;
