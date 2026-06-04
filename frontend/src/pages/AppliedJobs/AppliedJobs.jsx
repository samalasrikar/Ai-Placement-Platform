import React, { useState, useEffect } from 'react';
import api, { handleApiCall, mockData } from '../../services/api';
import { Layers, HelpCircle, MapPin, DollarSign } from 'lucide-react';

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      const results = await handleApiCall(
        () => api.get('/student/applications'),
        mockData.student.recentApplications
      );
      setApplications(results);
      setLoading(false);
    };
    fetchApplications();
  }, []);

  // Standard status timelines nodes list
  const stages = ['applied', 'shortlisted', 'interview_scheduled', 'selected'];

  const getStageIndex = (status) => {
    if (status === 'rejected') return 1; // Show rejected at second step
    return stages.indexOf(status);
  };

  const getStageColor = (idx, currentStatus) => {
    const currentIndex = getStageIndex(currentStatus);
    
    if (currentStatus === 'rejected') {
      if (idx === 0) return 'bg-emerald-500 text-white';
      if (idx === 1) return 'bg-red-500 text-white';
      return 'bg-slate-900 border-slate-800 text-slate-600';
    }

    if (idx < currentIndex) return 'bg-emerald-500 text-white';
    if (idx === currentIndex) return 'bg-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]';
    return 'bg-slate-900 border-slate-800 text-slate-600';
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'applied':
        return 'We have successfully routed your credentials. The recruiter will check your file score shortly.';
      case 'shortlisted':
        return 'Awesome! Your profile matches requirements. The team is scheduling technical review panels.';
      case 'interview_scheduled':
        return 'Your interview is active! Practice technical question templates in our AI Chatbot.';
      case 'selected':
        return '🎉 Congratulations! The recruiter has finalized your selection. Offer letter templates are incoming.';
      case 'rejected':
        return 'The team has decided to pursue other profiles. Check similar vacancies on the listings tab.';
      default:
        return 'Status processing.';
    }
  };

  if (loading) {
    return (
      <div class="h-96 flex items-center justify-center">
        <div class="h-10 w-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div class="space-y-6">
      
      <div>
        <h2 class="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Layers class="h-5 w-5 text-cyan-400" /> Application Pipeline
        </h2>
        <p class="text-xs text-slate-400">Track current status milestones and review next step checklists</p>
      </div>

      {applications.length === 0 ? (
        <div class="glass-card p-8 rounded-2xl border border-slate-800 text-center py-12 text-xs text-slate-500 max-w-md mx-auto">
          You have not submitted job applications yet.
        </div>
      ) : (
        <div class="space-y-6">
          {applications.map((app) => (
            <div key={app.id} class="glass-card p-6 rounded-2xl border border-slate-800/80 bg-slate-900/10 space-y-6">
              
              {/* Header Info */}
              <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-900 pb-4">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center p-1.5 overflow-hidden shrink-0">
                    <img 
                      src={app.logo_url || 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg'} 
                      alt={app.company_name} 
                      class="h-full object-contain filter invert" 
                    />
                  </div>
                  <div>
                    <h3 class="text-sm font-bold text-slate-200">{app.job_title}</h3>
                    <p class="text-[10px] text-slate-400 mt-0.5">{app.company_name}</p>
                  </div>
                </div>

                <div class="flex flex-wrap gap-4 text-[10px] text-slate-500">
                  <span class="flex items-center gap-1"><MapPin class="h-3.5 w-3.5" /> {app.location || 'Hybrid'}</span>
                  <span class="flex items-center gap-1"><DollarSign class="h-3.5 w-3.5" /> {app.salary || '$120k LPA'}</span>
                </div>
              </div>

              {/* Status Timeline */}
              <div class="py-4">
                <div class="flex items-center justify-between relative max-w-2xl mx-auto">
                  
                  {/* Background connector line */}
                  <div class="absolute left-4 right-4 h-0.5 bg-slate-800 top-1/2 -translate-y-1/2 -z-10"></div>
                  
                  {stages.map((stage, idx) => {
                    const isActive = getStageIndex(app.status) >= idx;
                    return (
                      <div key={stage} class="flex flex-col items-center gap-2 relative">
                        <div class={`h-8 w-8 rounded-full border-2 flex items-center justify-center font-bold text-[10px] uppercase transition-all duration-300 z-10 ${getStageColor(idx, app.status)}`}>
                          {idx + 1}
                        </div>
                        <span class={`text-[9px] uppercase font-bold tracking-wider capitalize ${isActive ? 'text-slate-200' : 'text-slate-600'}`}>
                          {stage.replace('_', ' ')}
                        </span>
                      </div>
                    );
                  })}

                </div>
              </div>

              {/* Notification note card */}
              <div class="p-3.5 bg-slate-900/60 border border-slate-850 rounded-xl flex gap-3 items-start max-w-2xl mx-auto">
                <HelpCircle class="h-4.5 w-4.5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
                <div class="text-[11px] leading-relaxed">
                  <span class="font-bold text-slate-200 block">Checkpoint Feed:</span>
                  <p class="text-slate-400 mt-0.5">{getStatusMessage(app.status)}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AppliedJobs;
