import React, { useState, useEffect } from 'react';
import api, { handleApiCall, mockData } from '../../services/api';
import { Calendar, Video, Clock, CheckSquare } from 'lucide-react';

const InterviewManagement = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      // Fetch mock student dashboard since it contains the scheduled meetings seeds
      const mockResult = mockData.student.upcomingInterviews;
      setInterviews(mockResult);
      setLoading(false);
    };
    fetchInterviews();
  }, []);

  if (loading) {
    return (
      <div class="h-96 flex items-center justify-center">
        <div class="h-10 w-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div class="space-y-6 max-w-4xl mx-auto">
      
      <div>
        <h2 class="text-xl font-bold text-slate-100 flex items-center gap-2">
          <CheckSquare class="h-5 w-5 text-cyan-400" /> Interview Management
        </h2>
        <p class="text-xs text-slate-400">Track scheduled calls, video conferencing links, and candidate notes</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {interviews.length === 0 ? (
          <div class="glass-card p-6 text-center text-xs text-slate-500 col-span-2 py-12">
            No interview assessments slated.
          </div>
        ) : (
          interviews.map((meet) => (
            <div key={meet.id} class="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
              
              <div class="flex justify-between items-start">
                <div class="space-y-1">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Scheduled Call</h3>
                  <h4 class="text-sm font-bold text-slate-200">{meet.job_title}</h4>
                  <p class="text-[10px] text-cyan-400 font-semibold">{meet.company_name}</p>
                </div>
                <span class="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 font-bold capitalize">
                  {meet.status}
                </span>
              </div>

              <div class="space-y-2 border-t border-slate-900 pt-3 text-xs text-slate-300">
                <div class="flex items-center gap-2">
                  <Clock class="h-4 w-4 text-slate-500" />
                  <span>{new Date(meet.schedule_time).toLocaleString()}</span>
                </div>
                
                {meet.meeting_link && (
                  <div class="flex items-center gap-2">
                    <Video class="h-4 w-4 text-slate-500" />
                    <a 
                      href={meet.meeting_link} 
                      target="_blank" 
                      rel="noreferrer" 
                      class="text-cyan-400 hover:underline truncate max-w-[200px]"
                    >
                      {meet.meeting_link}
                    </a>
                  </div>
                )}
              </div>

              {meet.recruiter_notes && (
                <div class="p-3 bg-slate-900/40 border border-slate-850 rounded-xl text-[10px] text-slate-400 leading-relaxed">
                  <span class="font-bold text-slate-300 block mb-0.5">Recruiter Assessment Syllabus:</span>
                  {meet.recruiter_notes}
                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default InterviewManagement;
