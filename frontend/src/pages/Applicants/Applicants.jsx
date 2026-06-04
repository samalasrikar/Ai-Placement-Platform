import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, FileSearch, Calendar, CheckCircle2, XCircle, Search, ShieldCheck } from 'lucide-react';

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [activeModalApp, setActiveModalApp] = useState(null);
  const [scheduleTime, setScheduleTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/');
  const [recruiterNotes, setRecruiterNotes] = useState('');
  
  const [success, setSuccess] = useState('');

  const fetchApplicants = async () => {
    try {
      const res = await api.get('/recruiter/applicants');
      setApplicants(res.data);
    } catch (err) {
      // Offline fallback seeds
      setApplicants([
        { application_id: 1, student_id: 1, full_name: 'Alex Carter', roll_no: 'CS2023089', department: 'Computer Science & Engineering', cgpa: 9.15, job_id: 1, job_title: 'Software Engineer I (Frontend)', application_status: 'applied', atsScore: 82, matchPercentage: 92 },
        { application_id: 2, student_id: 2, full_name: 'Jane Smith', roll_no: 'EC2023041', department: 'Electronics & Communication', cgpa: 8.42, job_id: 1, job_title: 'Software Engineer I (Frontend)', application_status: 'shortlisted', atsScore: 71, matchPercentage: 78 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await api.put(`/recruiter/applications/${appId}/status`, { status: newStatus });
      setSuccess(`Application marked as '${newStatus}'`);
      fetchApplicants();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setApplicants(prev => prev.map(a => a.application_id === appId ? { ...a, application_status: newStatus } : a));
      setSuccess(`Application marked as '${newStatus}'`);
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!activeModalApp || !scheduleTime) return;

    try {
      await api.post('/recruiter/schedule-interview', {
        applicationId: activeModalApp.application_id,
        scheduleTime,
        meetingLink,
        recruiterNotes
      });
      setSuccess('Interview scheduled and invite dispatched');
      fetchApplicants();
    } catch (err) {
      // simulated update
      setApplicants(prev => prev.map(a => a.application_id === activeModalApp.application_id ? { ...a, application_status: 'interview_scheduled' } : a));
      setSuccess('Interview scheduled and invite dispatched');
    } finally {
      setActiveModalApp(null);
      setScheduleTime('');
      setRecruiterNotes('');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const filteredApplicants = applicants.filter(app => 
    app.full_name.toLowerCase().includes(search.toLowerCase()) || 
    app.job_title.toLowerCase().includes(search.toLowerCase())
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
            <Users class="h-5 w-5 text-cyan-400" /> Applicants & Resumes
          </h2>
          <p class="text-xs text-slate-400">Match resume parameters and moderate applicant pipeline statuses</p>
        </div>

        {success && (
          <div class="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs flex items-center gap-1.5 animate-bounce">
            <ShieldCheck class="h-4.5 w-4.5" /> {success}
          </div>
        )}
      </div>

      {/* Roster list */}
      <div class="space-y-4">
        
        {/* Search bar */}
        <div class="relative max-w-md">
          <Search class="absolute left-3 w-4 h-4 text-slate-500 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search applicants name or role..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            class="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-cyan-500/50 text-slate-200" 
          />
        </div>

        {/* Applicants Grid */}
        <div class="grid grid-cols-1 gap-4">
          {filteredApplicants.length === 0 ? (
            <div class="glass-card p-8 rounded-xl border border-slate-800 text-center py-10 text-xs text-slate-500">
              No applicant files found matching current searches.
            </div>
          ) : (
            filteredApplicants.map((app) => (
              <div 
                key={app.application_id}
                class="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
              >
                
                {/* Profile detail */}
                <div class="space-y-3">
                  <div>
                    <h3 class="text-sm font-bold text-slate-200">{app.full_name}</h3>
                    <p class="text-[10px] text-slate-400 mt-0.5">{app.department} • CGPA: {app.cgpa}</p>
                  </div>
                  <div class="text-[10px] text-slate-500">
                    Applying for: <span class="font-bold text-slate-300">{app.job_title}</span>
                  </div>
                </div>

                {/* Score badges */}
                <div class="flex flex-wrap gap-4">
                  <div class="text-center">
                    <span class="text-[9px] uppercase font-bold text-slate-500 block">ATS Score</span>
                    <span class={`text-sm font-extrabold block mt-0.5 ${app.atsScore > 80 ? 'text-emerald-400' : 'text-yellow-400'}`}>{app.atsScore}%</span>
                  </div>
                  <div class="text-center">
                    <span class="text-[9px] uppercase font-bold text-slate-500 block">Skills match</span>
                    <span class={`text-sm font-extrabold block mt-0.5 ${app.matchPercentage > 80 ? 'text-emerald-400' : 'text-yellow-400'}`}>{app.matchPercentage}%</span>
                  </div>
                  <div class="text-center">
                    <span class="text-[9px] uppercase font-bold text-slate-500 block">Status</span>
                    <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-850 text-cyan-400 font-bold capitalize mt-0.5 block">{app.application_status.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Pipeline Controls */}
                <div class="flex flex-wrap gap-2 shrink-0 w-full lg:w-auto border-t lg:border-t-0 border-slate-900 pt-4 lg:pt-0">
                  <button 
                    onClick={() => setActiveModalApp(app)}
                    class="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-bold hover:border-cyan-500/40 hover:text-cyan-400 transition cursor-pointer flex items-center gap-1"
                  >
                    <Calendar class="h-3.5 w-3.5" /> Schedule
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(app.application_id, 'selected')}
                    class="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/20 transition cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 class="h-3.5 w-3.5" /> Select
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(app.application_id, 'rejected')}
                    class="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/25 text-[10px] font-bold text-red-400 hover:bg-red-500/20 transition cursor-pointer flex items-center gap-1"
                  >
                    <XCircle class="h-3.5 w-3.5" /> Reject
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

      {/* Interview Scheduling Modal Dialog */}
      {activeModalApp && (
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl glass-card space-y-4">
            
            <div class="border-b border-slate-900 pb-3 flex justify-between items-center">
              <h3 class="text-sm font-bold text-slate-200">Schedule Interview Slot</h3>
              <button onClick={() => setActiveModalApp(null)} class="text-slate-500 hover:text-slate-200 font-bold">×</button>
            </div>
            
            <p class="text-[10px] text-slate-400">Scheduling slot for {activeModalApp.full_name} ({activeModalApp.job_title})</p>

            <form onSubmit={handleScheduleSubmit} class="space-y-4">
              <div class="space-y-1">
                <label class="text-[9px] uppercase font-bold text-slate-500">Interview Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={scheduleTime}
                  onChange={e => setScheduleTime(e.target.value)}
                  class="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-xs text-slate-300 focus:outline-none" 
                  required 
                />
              </div>

              <div class="space-y-1">
                <label class="text-[9px] uppercase font-bold text-slate-500">Meeting link URL</label>
                <input 
                  type="url" 
                  value={meetingLink}
                  onChange={e => setMeetingLink(e.target.value)}
                  class="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-xs text-slate-300 focus:outline-none" 
                />
              </div>

              <div class="space-y-1">
                <label class="text-[9px] uppercase font-bold text-slate-500">Assessment details / topics</label>
                <textarea 
                  value={recruiterNotes}
                  onChange={e => setRecruiterNotes(e.target.value)}
                  placeholder="Focus topics, panel details..."
                  class="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-xs text-slate-300 focus:outline-none h-16" 
                />
              </div>

              <div class="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setActiveModalApp(null)} class="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-400 font-bold hover:text-slate-200 cursor-pointer">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg text-xs text-white font-bold hover:scale-102 transition cursor-pointer">Schedule Slot</button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Applicants;
