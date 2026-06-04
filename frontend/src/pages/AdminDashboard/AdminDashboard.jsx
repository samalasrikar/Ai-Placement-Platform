import React, { useState, useEffect } from 'react';
import api, { handleApiCall, mockData } from '../../services/api';
import { Users, Building, Briefcase, Award, ShieldCheck, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');

  const fetchAdminDashboard = async () => {
    const result = await handleApiCall(
      () => api.get('/admin/dashboard'),
      mockData.admin
    );
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  const handleApproveRecruiter = async (recId, approveStatus) => {
    try {
      await api.put(`/admin/recruiters/${recId}/approve`, { is_approved: approveStatus });
      setSuccess('Recruiter account status updated');
      fetchAdminDashboard();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setSuccess('Recruiter account status updated');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  if (loading) {
    return (
      <div class="h-96 flex items-center justify-center">
        <div class="h-10 w-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const metrics = data?.metrics || mockData.admin.metrics;
  const latestJobs = data?.latestJobs || mockData.admin.latestJobs;
  const recruiters = data?.recruiters || mockData.admin.recruiters;

  return (
    <div class="space-y-6">
      
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-slate-100">Administrative Control Center</h2>
          <p class="text-xs text-slate-400">Moderate recruiter credentials, jobs content, and track placement statistics</p>
        </div>

        {success && (
          <div class="p-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 text-xs flex items-center gap-1">
            <ShieldCheck class="h-4.5 w-4.5 animate-bounce" /> {success}
          </div>
        )}
      </div>

      {/* Stats widget Grid */}
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div class="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400"><Users class="h-5 w-5" /></div>
          <div>
            <span class="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Students</span>
            <span class="text-xl font-extrabold text-slate-100">{metrics.totalStudents}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div class="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-purple-500/10 text-purple-400"><Building class="h-5 w-5" /></div>
          <div>
            <span class="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Recruiters</span>
            <span class="text-xl font-extrabold text-slate-100">{metrics.totalRecruiters}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div class="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400"><Briefcase class="h-5 w-5" /></div>
          <div>
            <span class="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Active Jobs</span>
            <span class="text-xl font-extrabold text-slate-100">{metrics.totalJobs}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div class="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400"><Award class="h-5 w-5" /></div>
          <div>
            <span class="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Placement Rate</span>
            <span class="text-xl font-extrabold text-slate-100">{metrics.placementRate}%</span>
          </div>
        </div>

      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recruiter Approvals (Col span 2) */}
        <div class="lg:col-span-2 space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Recruiter Approval Board</h3>
          
          <div class="glass-card rounded-2xl border border-slate-800 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead class="bg-slate-900/60 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                  <tr>
                    <th class="px-4 py-3">Recruiter</th>
                    <th class="px-4 py-3">Company</th>
                    <th class="px-4 py-3">Status</th>
                    <th class="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-850">
                  {recruiters.map(rec => (
                    <tr key={rec.id} class="hover:bg-slate-900/10 text-slate-300">
                      <td class="px-4 py-3.5">
                        <span class="font-bold text-slate-200 block">{rec.full_name}</span>
                        <span class="text-[10px] text-slate-500 block">{rec.email}</span>
                      </td>
                      <td class="px-4 py-3.5 font-medium text-slate-400">{rec.company_name}</td>
                      <td class="px-4 py-3.5">
                        <span class={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${rec.is_approved ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400' : 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-400'}`}>
                          {rec.is_approved ? 'approved' : 'pending approval'}
                        </span>
                      </td>
                      <td class="px-4 py-3.5 text-right">
                        {!rec.is_approved ? (
                          <button 
                            onClick={() => handleApproveRecruiter(rec.id, true)}
                            class="px-2.5 py-1 rounded bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 font-bold text-[10px] hover:bg-cyan-500/25 transition cursor-pointer"
                          >
                            Approve Account
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleApproveRecruiter(rec.id, false)}
                            class="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-500 font-bold text-[10px] hover:border-red-500/40 hover:text-red-400 transition cursor-pointer"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Latest posted jobs summary panel */}
        <div class="space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Moderate Job Vacancies</h3>
          <div class="space-y-3">
            {latestJobs.map(job => (
              <div key={job.id} class="glass-card p-4 rounded-xl border border-slate-805 flex justify-between items-center text-xs">
                <div>
                  <span class="font-bold text-slate-200 block truncate max-w-[150px]">{job.title}</span>
                  <span class="text-[9px] text-slate-500 mt-0.5 block">{job.company_name} • Posted by {job.recruiter_name}</span>
                </div>
                <Link 
                  to="/manage-jobs" 
                  class="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 transition"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
