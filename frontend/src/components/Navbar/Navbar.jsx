import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Bell, User, LogOut, ChevronDown, Cpu, Sparkles } from 'lucide-react';
import api from '../../services/api';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const res = await api.get('/student/notifications');
        setNotifications(res.data);
      } catch (err) {
        // Mock fallback if offline
        setNotifications([
          { id: 1, title: 'Interview Scheduled', message: 'Your interview for Frontend Engineer at Google has been scheduled.', is_read: 0, created_at: new Date() },
          { id: 2, title: 'Profile Updated', message: 'Your profile completion rate is now 85%.', is_read: 1, created_at: new Date() }
        ]);
      }
    };
    fetchNotifications();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/student/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (err) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <nav class="h-16 border-b border-slate-800/80 bg-bg-dark/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Platform Branding */}
      <Link to="/" class="flex items-center gap-2 group">
        <div class="p-1.5 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <Cpu class="h-5 w-5 text-white animate-pulse" />
        </div>
        <span class="font-bold text-lg bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent group-hover:neon-text-glow transition">
          NEXUS<span class="text-cyan-400 font-extrabold ml-1">AI</span>
        </span>
      </Link>

      {/* Utilities */}
      <div class="flex items-center gap-4">
        {/* Notification Bell */}
        <div class="relative">
          <button 
            onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            class="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30 transition shadow-lg"
          >
            <Bell class="h-5 w-5" />
            {unreadCount > 0 && (
              <span class="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            )}
          </button>

          {showNotif && (
            <div class="absolute right-0 mt-3 w-80 rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-2xl z-50 glass-card">
              <div class="px-3 py-2 border-b border-slate-800 flex justify-between items-center">
                <span class="font-semibold text-sm text-slate-200">Alert Center</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-medium">
                  {unreadCount} Unread
                </span>
              </div>
              <div class="max-h-64 overflow-y-auto mt-2">
                {notifications.length === 0 ? (
                  <p class="text-xs text-slate-500 text-center py-6">No new notifications</p>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => markAsRead(n.id)}
                      class={`p-3 rounded-lg hover:bg-slate-900/50 transition cursor-pointer mb-1 border ${n.is_read ? 'border-transparent text-slate-400' : 'border-cyan-500/20 bg-cyan-500/5 text-slate-200'}`}
                    >
                      <div class="flex justify-between items-start gap-2">
                        <span class="font-semibold text-xs">{n.title}</span>
                        {!n.is_read && <span class="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0"></span>}
                      </div>
                      <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Trigger */}
        <div class="relative">
          <button 
            onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            class="flex items-center gap-2 p-1.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-cyan-500/30 transition text-slate-300"
          >
            <div class="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <div class="text-left hidden md:block max-w-[120px]">
              <p class="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Developer'}</p>
              <p class="text-[10px] text-cyan-400 capitalize">{user?.role || 'Guest'}</p>
            </div>
            <ChevronDown class="h-4 w-4 text-slate-400" />
          </button>

          {showProfile && (
            <div class="absolute right-0 mt-3 w-52 rounded-xl border border-slate-800 bg-slate-950 p-1 shadow-2xl z-50 glass-card">
              <div class="px-3 py-2 border-b border-slate-800">
                <p class="text-xs text-slate-400">Authenticated as</p>
                <p class="text-xs font-semibold text-slate-200 truncate">{user?.email}</p>
              </div>
              <Link 
                to={user?.role === 'student' ? '/profile' : user?.role === 'recruiter' ? '/recruiter-dashboard' : '/admin-dashboard'}
                onClick={() => setShowProfile(false)}
                class="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-slate-900 text-xs text-slate-300 transition"
              >
                <User class="h-4 w-4" />
                Control Center
              </Link>
              <button 
                onClick={handleLogout}
                class="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 text-xs transition text-left"
              >
                <LogOut class="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
