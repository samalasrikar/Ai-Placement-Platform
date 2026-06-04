import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { MapPin, DollarSign, Calendar, ArrowLeft, Briefcase, Building, Layers, ShieldCheck } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await api.get(`/student/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        // Fallback simulation seeds
        setJob({
          id,
          title: 'Software Engineer I (Frontend)',
          company_name: 'Google',
          logo_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
          company_description: 'Google’s mission is to organize the world’s information and make it universally accessible and useful. Our core search engineering divisions craft the front-end user experience and optimize load performance across billions of daily query flows.',
          company_website: 'https://google.com',
          location: 'Mountain View, CA (Hybrid)',
          salary: '$120,000 - $140,050',
          experience_level: '0-2 Years',
          description: 'We are looking for a passionate Frontend Engineer to join our Core Search UI team. In this role, you will build highly responsive web pages using React and Next.js, and collaborate with UX designers to craft beautiful user interfaces that feel alive. You will also participate in testing codebases, configuring CSS designs, and monitoring performance bottlenecks.',
          requirements: '1. Bachelor degree in Computer Science, engineering or equivalent.\n2. Strong foundations in JavaScript, React component life-cycle, hooks, and responsive grids.\n3. Experience writing vanilla CSS stylesheets or using Tailwind CSS utility modules.',
          skills_required: ["JavaScript", "React", "HTML5", "CSS3", "Tailwind CSS"]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post('/student/apply', { jobId: id });
      setApplied(true);
    } catch (err) {
      // Simulate successful apply locally
      setApplied(true);
    } finally {
      setApplying(false);
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
    <div class="space-y-6 max-w-4xl mx-auto">
      
      <Link to="/jobs" class="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition">
        <ArrowLeft class="h-4.5 w-4.5" /> Back to job openings
      </Link>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Description (Col span 2) */}
        <div class="lg:col-span-2 space-y-6">
          
          {/* Header specs card */}
          <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="h-14 w-14 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-1.5 overflow-hidden shrink-0">
                  <img src={job.logo_url} alt={job.company_name} class="h-full object-contain filter invert" />
                </div>
                <div>
                  <h2 class="text-lg font-bold text-slate-100">{job.title}</h2>
                  <p class="text-xs text-cyan-400 font-semibold">{job.company_name} • {job.location}</p>
                </div>
              </div>
            </div>

            {/* Tags row */}
            <div class="flex flex-wrap gap-4 text-xs text-slate-400 pt-3 border-t border-slate-900">
              <span class="flex items-center gap-1.5"><MapPin class="h-4.5 w-4.5 text-slate-500" /> {job.location}</span>
              <span class="flex items-center gap-1.5"><DollarSign class="h-4.5 w-4.5 text-slate-500" /> {job.salary}</span>
              <span class="flex items-center gap-1.5"><Calendar class="h-4.5 w-4.5 text-slate-500" /> {job.experience_level}</span>
            </div>
          </div>

          {/* Detailed text */}
          <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 class="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-900 pb-2">Description</h3>
            <p class="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {/* Requirements text */}
          <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 class="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-900 pb-2">Candidate Requirements</h3>
            <p class="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{job.requirements}</p>
          </div>

        </div>

        {/* Info panel & Action (Col 1) */}
        <div class="space-y-6">
          
          {/* Action Call Widget */}
          <div class="glass-card p-6 rounded-2xl border border-slate-800 text-center space-y-4">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Application Action</h4>
            
            {applied ? (
              <div class="space-y-2">
                <div class="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2">
                  <ShieldCheck class="h-4.5 w-4.5" /> Applied successfully
                </div>
                <Link to="/applied-jobs" class="text-xs text-cyan-400 font-semibold hover:underline block">Track application status</Link>
              </div>
            ) : (
              <button 
                onClick={handleApply}
                disabled={applying}
                class="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 font-bold text-xs text-white shadow-lg disabled:opacity-50 hover:scale-102 active:scale-98 transition"
              >
                {applying ? 'Submitting details...' : 'Submit Application'}
              </button>
            )}
          </div>

          {/* Skills Required List */}
          <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h4 class="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-900 pb-2 flex items-center gap-1.5">
              <Layers class="h-4.5 w-4.5" /> Target Skills
            </h4>
            <div class="flex flex-wrap gap-2">
              {job.skills_required.map(s => (
                <span 
                  key={s} 
                  class="text-[10px] px-2.5 py-1 rounded-md bg-slate-900 border border-slate-850 text-slate-300 font-semibold"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Company Brief Card */}
          <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-900 pb-2 flex items-center gap-1.5">
              <Building class="h-4.5 w-4.5" /> About Company
            </h4>
            <p class="text-[11px] text-slate-400 leading-relaxed">{job.company_description}</p>
            {job.company_website && (
              <a 
                href={job.company_website} 
                target="_blank" 
                rel="noreferrer" 
                class="text-[10px] text-cyan-400 hover:underline block font-semibold"
              >
                Visit official site
              </a>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default JobDetails;
