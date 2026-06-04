import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { User, Mail, Lock, BookOpen, Briefcase, Cpu } from 'lucide-react';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [role, setRole] = useState('student'); // student, recruiter
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Student Specific
  const [rollNo, setRollNo] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [cgpa, setCgpa] = useState('');
  
  // Recruiter Specific
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in name, email, and password.');
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      role,
      name,
      email,
      password,
      rollNo,
      department,
      cgpa,
      companyName,
      companyWebsite
    };

    try {
      const user = await register(payload);
      if (user.role === 'student') navigate('/student-dashboard');
      else if (user.role === 'recruiter') navigate('/recruiter-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try checking your info.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-bg-dark flex items-center justify-center p-6 relative">
      
      {/* Background glow elements */}
      <div class="absolute w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] -z-10 top-1/4 left-1/4 animate-pulse"></div>
      <div class="absolute w-[250px] h-[250px] bg-cyan-500/10 rounded-full blur-[90px] -z-10 bottom-1/4 right-1/4 animate-pulse"></div>

      <div class="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950/45 p-8 shadow-2xl glass-card flex flex-col items-center">
        
        {/* Branding banner */}
        <div class="flex items-center gap-2 mb-4">
          <div class="p-1 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-500 text-white shadow-md">
            <Cpu class="h-5 w-5" />
          </div>
          <span class="font-extrabold text-lg bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            NEXUS<span class="text-cyan-400">AI</span>
          </span>
        </div>

        <div class="text-center space-y-1 mb-6">
          <h2 class="text-xl font-bold text-slate-100">Create Account</h2>
          <p class="text-xs text-slate-500">Sign up to access AI recruitment modules</p>
        </div>

        {error && (
          <div class="w-full mb-4 p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        {/* Role Toggle Selector */}
        <div class="grid grid-cols-2 gap-2 bg-slate-900/60 p-1 rounded-xl w-full border border-slate-800 mb-6">
          <button 
            type="button" 
            onClick={() => setRole('student')}
            class={`py-2 rounded-lg font-bold text-xs transition ${role === 'student' ? 'bg-cyan-500/15 border border-cyan-500/20 text-cyan-400' : 'text-slate-400'}`}
          >
            I am a Student
          </button>
          <button 
            type="button" 
            onClick={() => setRole('recruiter')}
            class={`py-2 rounded-lg font-bold text-xs transition ${role === 'recruiter' ? 'bg-purple-500/15 border border-purple-500/20 text-purple-400' : 'text-slate-400'}`}
          >
            I am a Recruiter
          </button>
        </div>

        <form onSubmit={handleSubmit} class="w-full space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Core Fields */}
            <div class="space-y-1">
              <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
              <div class="relative">
                <User class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50" 
                />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div class="relative">
                <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@placement.com"
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50" 
                />
              </div>
            </div>

            <div class="space-y-1 sm:col-span-2">
              <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Password</label>
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

            {/* Student Specific Sub-form */}
            {role === 'student' && (
              <>
                <div class="space-y-1">
                  <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Roll Number</label>
                  <div class="relative">
                    <BookOpen class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input 
                      type="text" 
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      placeholder="CS2026102"
                      class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50" 
                    />
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">CGPA</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    placeholder="9.20"
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50" 
                  />
                </div>

                <div class="space-y-1 sm:col-span-2">
                  <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Department</label>
                  <select 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50"
                  >
                    <option>Computer Science & Engineering</option>
                    <option>Electronics & Communication</option>
                    <option>Information Technology</option>
                    <option>Electrical Engineering</option>
                    <option>Mechanical Engineering</option>
                  </select>
                </div>
              </>
            )}

            {/* Recruiter Specific Sub-form */}
            {role === 'recruiter' && (
              <>
                <div class="space-y-1">
                  <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Company Name</label>
                  <div class="relative">
                    <Briefcase class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input 
                      type="text" 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Netflix"
                      class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50" 
                    />
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Company Website</label>
                  <input 
                    type="url" 
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://netflix.com"
                    class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50" 
                  />
                </div>
              </>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            class="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 font-bold text-xs text-white hover:scale-102 active:scale-98 transition shadow-lg shadow-purple-500/20 disabled:opacity-50"
          >
            {loading ? 'Processing Registration...' : 'Register Profile'}
          </button>
        </form>

        <p class="text-xs text-slate-400 text-center mt-6">
          Already have an account? <Link to="/login" class="text-cyan-400 font-semibold hover:underline">Log in here</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
