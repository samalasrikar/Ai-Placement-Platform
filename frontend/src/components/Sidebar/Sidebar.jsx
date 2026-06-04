import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileSearch,
  MessageSquareCode,
  Layers,
  Users,
  CheckSquare,
  BarChart3,
  FileDown,
  PlusCircle,
  Building
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const getNavLinks = () => {
    switch (user.role) {
      case 'student':
        return [
          { name: 'Dashboard', path: '/student-dashboard', icon: LayoutDashboard },
          { name: 'My Profile', path: '/profile', icon: User },
          { name: 'AI Resume Analyzer', path: '/resume-analyzer', icon: FileSearch },
          { name: 'AI Career Mentor', path: '/chatbot', icon: MessageSquareCode },
          { name: 'Job Openings', path: '/jobs', icon: Briefcase },
          { name: 'Application Tracker', path: '/applied-jobs', icon: Layers },
        ];

      case 'recruiter':
        return [
          { name: 'Dashboard', path: '/recruiter-dashboard', icon: LayoutDashboard },
          { name: 'Post Job', path: '/post-job', icon: PlusCircle },
          { name: 'Applicants & Resumes', path: '/applicants', icon: Users },
          { name: 'Interview Schedules', path: '/interviews', icon: CheckSquare },
        ];

      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
          { name: 'Manage Students', path: '/manage-students', icon: Users },
          { name: 'Manage Recruiters', path: '/manage-recruiters', icon: Building },
          { name: 'Moderate Jobs', path: '/manage-jobs', icon: Briefcase },
          { name: 'Analytics Suite', path: '/analytics', icon: BarChart3 },
          { name: 'Reports Generator', path: '/reports', icon: FileDown },
        ];

      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/40 min-h-[calc(100vh-4rem)] p-4 shrink-0 hidden md:block">
      
      <div className="space-y-2">
        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-3 mb-2">
          Main Menu
        </p>

        {navLinks.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-900/50 hover:border-slate-800'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* AI Copilot Card */}
      <div className="mt-8 p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 shadow-[inset_0_0_15px_rgba(139,92,246,0.05)] relative overflow-hidden group">
        
        <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition duration-300"></div>

        <h4 className="text-xs font-bold text-purple-300 flex items-center gap-2">
          <MessageSquareCode className="w-4 h-4" />
          AI Copilot Active
        </h4>

        <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
          AI analysis and recommendations are automatically updated.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;