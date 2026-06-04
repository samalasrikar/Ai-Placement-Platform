import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Mail, Lock, ShieldAlert, Cpu } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all credentials fields');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      // Route dynamically by role
      if (user.role === 'student') navigate('/student-dashboard');
      else if (user.role === 'recruiter') navigate('/recruiter-dashboard');
      else if (user.role === 'admin') navigate('/admin-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Helper shortcut to simplify verification
  const loadMockCredentials = (type) => {
    if (type === 'student') {
      setEmail('student@placement.com');
      setPassword('password123');
    } else if (type === 'recruiter') {
      setEmail('recruiter@google.com');
      setPassword('password123');
    } else if (type === 'admin') {
      setEmail('admin@placement.com');
      setPassword('password123');
    }
  };

  return (
    <div class="min-h-screen bg-bg-dark flex items-center justify-center p-6 relative">
      
      {/* Background glow blobs */}
      <div class="absolute w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] -z-10 top-1/4 left-1/4 animate-pulse"></div>
      <div class="absolute w-[250px] h-[250px] bg-cyan-500/10 rounded-full blur-[90px] -z-10 bottom-1/4 right-1/4 animate-pulse"></div>

      <div class="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/45 p-8 shadow-2xl glass-card flex flex-col items-center">
        
        {/* Branding header */}
        <div class="flex items-center gap-2 mb-6">
          <div class="p-1 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-500 text-white shadow-md">
            <Cpu class="h-6 w-6" />
          </div>
          <span class="font-extrabold text-xl bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            NEXUS<span class="text-cyan-400">AI</span>
          </span>
        </div>

        <div class="text-center space-y-1 mb-8 w-full">
          <h2 class="text-xl font-bold text-slate-100">Welcome Back</h2>
          <p class="text-xs text-slate-500">Sign in to manage your placement portal</p>
        </div>

        {error && (
          <div class="w-full mb-4 p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-xs flex items-center gap-2">
            <ShieldAlert class="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} class="w-full space-y-4">
          <div class="space-y-1">
            <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div class="relative">
              <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50" 
              />
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex justify-between items-center">
              <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" class="text-[10px] text-cyan-400 hover:underline">Forgot password?</Link>
            </div>
            <div class="relative">
              <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            class="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 font-bold text-xs text-white hover:scale-102 active:scale-98 transition-all duration-300 shadow-lg shadow-purple-500/20 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Helper Grid */}
        <div class="w-full mt-6 pt-6 border-t border-slate-900">
          <p class="text-[10px] text-slate-500 text-center mb-3">Load Test Account Profiles:</p>
          <div class="grid grid-cols-3 gap-2">
            <button 
              onClick={() => loadMockCredentials('student')}
              class="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-[10px] font-medium text-cyan-400 text-center transition"
            >
              Student
            </button>
            <button 
              onClick={() => loadMockCredentials('recruiter')}
              class="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-[10px] font-medium text-purple-400 text-center transition"
            >
              Recruiter
            </button>
            <button 
              onClick={() => loadMockCredentials('admin')}
              class="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-[10px] font-medium text-emerald-400 text-center transition"
            >
              Admin
            </button>
          </div>
        </div>

        <p class="text-xs text-slate-400 text-center mt-6">
          Don't have an account? <Link to="/register" class="text-cyan-400 font-semibold hover:underline">Register now</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
