import React, { useState, useEffect } from 'react';
import api, { handleApiCall, mockData } from '../../services/api';
import { Briefcase, Users, CheckSquare, Plus, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';

const RecruiterDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecruiterDashboard = async () => {
      const result = await handleApiCall(
        () => api.get('/recruiter/dashboard'),
        mockData.recruiter
      );
      setData(result);
      setLoading(false);
    };
    fetchRecruiterDashboard();
  }, []);

  if (loading) {
    return (
      <div class="h-96 flex items-center justify-center">
        <div class="h-10 w-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const metrics = data?.metrics || mockData.recruiter.metrics;
  const jobs = data?.jobs || mockData.recruiter.jobs;
  const statusAnalytics = data?.statusAnalytics || mockData.recruiter.statusAnalytics;

  // Format Recharts statistics
  const chartData = statusAnalytics.map(sa => ({
    name: sa.status.replace('_', ' '),
    applicants: sa.count
  }));

  return (
    <div class="space-y-6">
      
      {/* Top metrics grids */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div class="glass-card p-6 rounded-2xl border border-slate-800 flex items-center gap-4 relative overflow-hidden">
          <div class="absolute -right-8 -top-8 w-20 h-20 bg-cyan-500/5 rounded-full blur-xl"></div>
          <div class="p-3.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Briefcase class="h-6 w-6" />
          </div>
          <div>
            <span class="text-xs text-slate-500 font-medium block">Total Posted Jobs</span>
            <span class="text-2xl font-extrabold text-slate-100">{metrics.totalJobs}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div class="glass-card p-6 rounded-2xl border border-slate-800 flex items-center gap-4 relative overflow-hidden">
          <div class="absolute -right-8 -top-8 w-20 h-20 bg-purple-500/5 rounded-full blur-xl"></div>
          <div class="p-3.5 rounded-xl bg-purple-500/10 text-purple-400">
            <Users class="h-6 w-6" />
          </div>
          <div>
            <span class="text-xs text-slate-500 font-medium block">Total Applicants</span>
            <span class="text-2xl font-extrabold text-slate-100">{metrics.totalApplicants}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div class="glass-card p-6 rounded-2xl border border-slate-800 flex items-center gap-4 relative overflow-hidden">
          <div class="absolute -right-8 -top-8 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl"></div>
          <div class="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckSquare class="h-6 w-6" />
          </div>
          <div>
            <span class="text-xs text-slate-500 font-medium block">Interviews Scheduled</span>
            <span class="text-2xl font-extrabold text-slate-100">{metrics.interviewsScheduled}</span>
          </div>
        </div>

      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left col: Active Jobs list */}
        <div class="lg:col-span-2 space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400">Active Job Postings</h3>
            <Link 
              to="/post-job"
              class="px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 text-xs font-bold hover:bg-cyan-500/25 transition flex items-center gap-1"
            >
              <Plus class="h-4 w-4" /> Create Vacancy
            </Link>
          </div>

          <div class="space-y-3">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                class="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
              >
                <div>
                  <h4 class="text-xs font-bold text-slate-200">{job.title}</h4>
                  <p class="text-[10px] text-slate-500 mt-1">{job.location} • {job.salary}</p>
                  
                  {/* Skills required tags */}
                  <div class="flex flex-wrap gap-1 mt-3">
                    {job.skills_required.map(s => (
                      <span key={s} class="text-[9px] px-2 py-0.5 rounded bg-slate-900 border border-slate-850 text-slate-400 font-medium">{s}</span>
                    ))}
                  </div>
                </div>

                <div class="flex items-center gap-3 shrink-0">
                  <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-bold capitalize">
                    {job.status}
                  </span>
                  <Link 
                    to="/applicants" 
                    class="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 transition"
                  >
                    <ArrowUpRight class="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right col: Analytics Graph */}
        <div class="space-y-4">
          <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400">Applicants Funnel</h3>
          
          <div class="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-center min-h-[220px]">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 9 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 9 }} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#090F20', borderColor: '#1E293B' }} />
                <Bar dataKey="applicants" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default RecruiterDashboard;
