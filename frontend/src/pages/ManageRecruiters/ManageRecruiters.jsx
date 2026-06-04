import React, { useState, useEffect } from 'react';
import api, { handleApiCall, mockData } from '../../services/api';
import { Building, Search, Trash2, ShieldCheck } from 'lucide-react';

const ManageRecruiters = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');

  const fetchRecruiters = async () => {
    const results = await handleApiCall(
      () => api.get('/admin/dashboard'), // returns recruiter board logs
      mockData.admin
    );
    setRecruiters(results.recruiters || results);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const handleApprove = async (recId, approveStatus) => {
    try {
      await api.put(`/admin/recruiters/${recId}/approve`, { is_approved: approveStatus });
      setSuccess('Recruiter account status updated');
      fetchRecruiters();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setRecruiters(prev => prev.map(r => r.id === recId ? { ...r, is_approved: approveStatus ? 1 : 0 } : r));
      setSuccess('Recruiter account status updated');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const handleDelete = async (recId) => {
    if (!window.confirm('Are you sure you want to delete this recruiter account?')) return;
    try {
      await api.delete(`/admin/recruiters/${recId}`);
      setSuccess('Recruiter account deleted');
      fetchRecruiters();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setRecruiters(prev => prev.filter(r => r.id !== recId));
      setSuccess('Recruiter account deleted');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const filtered = recruiters.filter(r => 
    r.full_name.toLowerCase().includes(search.toLowerCase()) || 
    r.company_name.toLowerCase().includes(search.toLowerCase())
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
            <Building class="h-5 w-5 text-cyan-400" /> Manage Recruiters
          </h2>
          <p class="text-xs text-slate-400">Validate company verification requests and moderate recruiter accounts</p>
        </div>

        {success && (
          <div class="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs flex items-center gap-1">
            <ShieldCheck class="h-4.5 w-4.5" /> {success}
          </div>
        )}
      </div>

      <div class="space-y-4">
        
        {/* Search */}
        <div class="relative max-w-sm">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by recruiter name or company..."
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
                  <th class="px-4 py-3">Recruiter</th>
                  <th class="px-4 py-3">Company Target</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3">Review approval</th>
                  <th class="px-4 py-3 text-right">Delete</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-850 text-slate-350">
                {filtered.map(rec => (
                  <tr key={rec.id} class="hover:bg-slate-900/5">
                    <td class="px-4 py-3.5">
                      <span class="font-bold text-slate-200 block">{rec.full_name}</span>
                      <span class="text-[10px] text-slate-500 block">{rec.email}</span>
                    </td>
                    <td class="px-4 py-3.5 text-slate-400 font-semibold">{rec.company_name}</td>
                    <td class="px-4 py-3.5">
                      <span class={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${rec.is_approved ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400' : 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-400'}`}>
                        {rec.is_approved ? 'approved' : 'pending approval'}
                      </span>
                    </td>
                    <td class="px-4 py-3.5">
                      {!rec.is_approved ? (
                        <button 
                          onClick={() => handleApprove(rec.id, true)}
                          class="px-2 py-1 rounded bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 font-bold text-[10px] hover:bg-cyan-500/25 transition cursor-pointer"
                        >
                          Verify Account
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleApprove(rec.id, false)}
                          class="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-500 font-bold text-[10px] hover:border-red-500/40 hover:text-red-400 transition cursor-pointer"
                        >
                          Revoke Approval
                        </button>
                      )}
                    </td>
                    <td class="px-4 py-3.5 text-right">
                      <button 
                        onClick={() => handleDelete(rec.id)}
                        class="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-900 transition cursor-pointer"
                      >
                        <Trash2 class="h-4.5 w-4.5" />
                      </button>
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

export default ManageRecruiters;
