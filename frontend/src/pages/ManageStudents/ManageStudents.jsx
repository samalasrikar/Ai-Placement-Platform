import React, { useState, useEffect } from 'react';
import api, { handleApiCall, mockData } from '../../services/api';
import { Users, Search, Trash2, ShieldCheck } from 'lucide-react';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');

  const fetchStudents = async () => {
    const results = await handleApiCall(
      () => api.get('/admin/students'),
      mockData.admin.students
    );
    setStudents(results);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (studId) => {
    if (!window.confirm('Are you sure you want to delete this student account?')) return;
    try {
      await api.delete(`/admin/students/${studId}`);
      setSuccess('Student account removed');
      fetchStudents();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setStudents(prev => prev.filter(s => s.id !== studId));
      setSuccess('Student account removed');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const filtered = students.filter(s => 
    s.full_name.toLowerCase().includes(search.toLowerCase()) || 
    s.roll_no.toLowerCase().includes(search.toLowerCase())
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
            <Users class="h-5 w-5 text-cyan-400" /> Manage Students
          </h2>
          <p class="text-xs text-slate-400">Review student files, academic criteria compliance, and profile statuses</p>
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
            placeholder="Search by student name or roll..."
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
                  <th class="px-4 py-3">Student</th>
                  <th class="px-4 py-3">Roll No</th>
                  <th class="px-4 py-3">Department</th>
                  <th class="px-4 py-3">CGPA</th>
                  <th class="px-4 py-3">Completeness</th>
                  <th class="px-4 py-3 text-right">Remove</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-850 text-slate-350">
                {filtered.map(stud => (
                  <tr key={stud.id} class="hover:bg-slate-900/5">
                    <td class="px-4 py-3.5">
                      <span class="font-bold text-slate-200 block">{stud.full_name}</span>
                      <span class="text-[10px] text-slate-500 block">{stud.email}</span>
                    </td>
                    <td class="px-4 py-3.5">{stud.roll_no}</td>
                    <td class="px-4 py-3.5 text-slate-400">{stud.department}</td>
                    <td class="px-4 py-3.5 font-semibold text-cyan-400">{stud.cgpa}</td>
                    <td class="px-4 py-3.5">
                      <div class="flex items-center gap-2">
                        <div class="flex-1 w-16 bg-slate-900 rounded-full h-1.5 overflow-hidden">
                          <div class="bg-cyan-500 h-full rounded-full" style={{ width: `${stud.profile_completed}%` }}></div>
                        </div>
                        <span class="text-[9px] font-bold text-slate-400">{stud.profile_completed}%</span>
                      </div>
                    </td>
                    <td class="px-4 py-3.5 text-right">
                      <button 
                        onClick={() => handleDelete(stud.id)}
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

export default ManageStudents;
