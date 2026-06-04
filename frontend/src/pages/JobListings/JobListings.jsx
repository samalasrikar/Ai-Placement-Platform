import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { handleApiCall, mockData } from '../../services/api';
import { Search, MapPin, DollarSign, Calendar, SlidersHorizontal, ArrowUpRight, TrendingUp } from 'lucide-react';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const results = await handleApiCall(
        () => api.get('/student/jobs'),
        mockData.student.recommendedJobs
      );
      setJobs(results);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const titleMatch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                       job.company_name.toLowerCase().includes(search.toLowerCase());
    const locMatch = locationFilter ? job.location.toLowerCase().includes(locationFilter.toLowerCase()) : true;
    const roleMatch = roleFilter ? job.title.toLowerCase().includes(roleFilter.toLowerCase()) : true;
    
    return titleMatch && locMatch && roleMatch;
  });

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
          Job Board Vacancies
        </h2>
        <p class="text-xs text-slate-400">Discover and apply to verified startup and enterprise openings</p>
      </div>

      {/* Filter Toolbar */}
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950 p-4 border border-slate-900 rounded-2xl">
        <div class="relative md:col-span-2">
          <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by role name or company name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50" 
          />
        </div>

        <div>
          <select 
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
            class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="">All Locations</option>
            <option value="Mountain View">Mountain View, CA</option>
            <option value="Redmond">Redmond, WA</option>
            <option value="San Francisco">San Francisco, CA</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div>
          <select 
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="">All Job Roles</option>
            <option value="Frontend">Frontend / UI</option>
            <option value="Backend">Backend / API</option>
            <option value="Machine Learning">Machine Learning</option>
          </select>
        </div>
      </div>

      {/* Listing Cards Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.length === 0 ? (
          <p class="text-xs text-slate-500 py-12 text-center col-span-2">No matching vacancies found matching filters.</p>
        ) : (
          filteredJobs.map(job => (
            <div 
              key={job.id} 
              class="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between"
            >
              
              <div class="space-y-4">
                <div class="flex justify-between items-start gap-4">
                  <div class="flex items-center gap-3">
                    <div class="h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-1.5 overflow-hidden">
                      <img 
                        src={job.logo_url || 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg'} 
                        alt={job.company_name} 
                        class="h-full object-contain filter invert" 
                      />
                    </div>
                    <div>
                      <h3 class="text-sm font-bold text-slate-200">{job.title}</h3>
                      <p class="text-[10px] text-slate-400 mt-0.5">{job.company_name}</p>
                    </div>
                  </div>
                  
                  {job.matchPercentage && (
                    <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-[10px] font-bold">
                      <TrendingUp class="h-3 w-3" /> {job.matchPercentage}% match
                    </div>
                  )}
                </div>

                <p class="text-xs text-slate-400 leading-relaxed line-clamp-3">{job.description}</p>
                
                {/* Details list info */}
                <div class="flex flex-wrap gap-4 text-[10px] text-slate-500 pt-2">
                  <span class="flex items-center gap-1"><MapPin class="h-3.5 w-3.5" /> {job.location}</span>
                  <span class="flex items-center gap-1"><DollarSign class="h-3.5 w-3.5" /> {job.salary}</span>
                  <span class="flex items-center gap-1"><Calendar class="h-3.5 w-3.5" /> {job.experience_level || '0-2 Years'}</span>
                </div>
              </div>

              <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-900">
                <Link 
                  to={`/jobs/${job.id}`}
                  class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs hover:border-cyan-500/40 hover:text-cyan-400 transition"
                >
                  View Details
                </Link>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default JobListings;
