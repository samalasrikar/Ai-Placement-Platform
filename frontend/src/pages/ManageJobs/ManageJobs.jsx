import React, { useState, useEffect } from 'react';
import api, { handleApiCall, mockData } from '../../services/api';
import { Briefcase, Search, Trash2, ShieldCheck, CheckSquare, XSquare } from 'lucide-react';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');

  const fetchJobs = async () => {
    try {
      const res = await api.get('/admin/jobs');
      setJobs(res.data);
    } catch (err) {
      // simulated fallback seeds
      setJobs([
        { id: 1, title: 'Software Engineer I (Frontend)', company_name: 'Google', recruiter_name: 'Sarah Jenkins', salary: '$120,000 - $140,000', location: 'Mountain View', status: 'approved' },
        { id: 2, title: 'Cloud Software Engineer (Backend)', company_name: 'Microsoft', recruiter_name: 'David Chen', salary: '$135,000 - $160,000', location: 'Redmond', status: 'approved' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleModerate = async (jobId, newStatus) => {
    try {
      await api.put(`/admin/jobs/${jobId}/moderate`, { status: newStatus });
      setSuccess(`Job opening marked as '${newStatus}'`);
      fetchJobs();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
      setSuccess(`Job opening marked as '${newStatus}'`);
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const filtered = jobs.filter(j => 
    j.title.toLowerCase().includes(search.toLowerCase()) || 
    j.company_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div class="h-96 flex items-center justify-center">
        <div class="h-10 w-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div class="space-y-6">
      
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Briefcase class="h-5 w-5 text-cyan-400" /> Moderate Job Openings
          </h2>
          <p class="text-xs text-slate-400">Moderate active job specifications published across the platform listings</p>
        </div>

        {success && (
          <div class="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs flex items-center gap-1">
            <ShieldCheck class="h-4.5 w-4.5 animate-bounce" /> {success}
          </div>
        )}
      </div>

      <div class="space-y-4">
        
        {/* Search */}
        <div class="relative max-w-sm">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by job title or company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            class="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-cyan-500/50 text-slate-200" 
          />
        </div>

        {/* Table list */}
        <div class="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left">
              <thead class="bg-slate-900/60 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th class="px-4 py-3">Job Listing</th>
                  <th class="px-4 py-3">Posted By</th>
                  <th class="px-4 py-3">Salary & Location</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3 text-right">Moderations</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-850 text-slate-350">
                {filtered.map(job => (
                  <tr key={job.id} class="hover:bg-slate-900/5">
                    <td class="px-4 py-3.5">
                      <span class="font-bold text-slate-200 block">{job.title}</span>
                      <span class="text-[10px] text-cyan-400 block">{job.company_name}</span>
                    </td>
                    <td class="px-4 py-3.5 text-slate-400">{job.recruiter_name}</td>
                    <td class="px-4 py-3.5">
                      <span class="block">{job.salary}</span>
                      <span class="text-[10px] text-slate-500 block">{job.location}</span>
                    </td>
                    <td class="px-4 py-3.5">
                      <span class={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${job.status === 'approved' ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400' : 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-400'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td class="px-4 py-3.5 text-right flex items-center justify-end gap-1.5 pt-4">
                      {job.status !== 'approved' ? (
                        <button 
                          onClick={() => handleModerate(job.id, 'approved')}
                          class="p-1 rounded bg-slate-900 border border-slate-800 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30 transition cursor-pointer"
                          title="Approve Job"
                        >
                          <CheckSquare class="h-4.5 w-4.5" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleModerate(job.id, 'removed')}
                          class="p-1 rounded bg-slate-900 border border-slate-800 text-slate-500 hover:text-yellow-500 hover:border-yellow-500/30 transition cursor-pointer"
                          title="Suspend/Remove"
                        >
                          <XSquare class="h-4.5 w-4.5" />
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

    </div>
  );
};

export default ManageJobs;
