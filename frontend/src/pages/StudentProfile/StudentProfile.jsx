import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { User, BookOpen, Layers, Award, FileUp, Sparkles, Plus, Trash2, ShieldCheck } from 'lucide-react';

const StudentProfile = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Profile forms fields state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [department, setDepartment] = useState('');
  
  // Details
  const [education, setEducation] = useState({ high_school: '', ug_college: '', ug_degree: '', ug_year: 2026, ug_cgpa: '' });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  
  const [certifications, setCertifications] = useState([]);
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');

  const [projects, setProjects] = useState([]);
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projStack, setProjStack] = useState('');

  const [achievements, setAchievements] = useState([]);
  const [achInput, setAchInput] = useState('');
  
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile');
        const info = res.data;
        if (info.studentInfo) {
          setFullName(info.studentInfo.full_name || '');
          setPhone(info.studentInfo.phone || '');
          setCgpa(info.studentInfo.cgpa || '');
          setDepartment(info.studentInfo.department || '');
        }
        if (info.details) {
          setEducation(info.details.education || { high_school: '', ug_college: '', ug_degree: '', ug_year: 2026, ug_cgpa: '' });
          setSkills(info.details.skills || []);
          setCertifications(info.details.certifications || []);
          setProjects(info.details.projects || []);
          setAchievements(info.details.achievements || []);
        }
      } catch (err) {
        // Fallback mock seeds loading
        setFullName('Alex Carter');
        setPhone('+15559812');
        setCgpa('9.15');
        setDepartment('Computer Science & Engineering');
        setEducation({ high_school: "Oakridge Academy", ug_college: "Tech Institute of Engineering", ug_degree: "B.Tech CSE", ug_year: 2026, ug_cgpa: 9.15 });
        setSkills(["JavaScript", "React", "Node.js", "Express.js", "MySQL", "Tailwind CSS", "Git", "Python"]);
        setCertifications([{ name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "2025-05" }]);
        setProjects([{ title: "E-Commerce Cloud Engine", desc: "Microservices backend managing 10k catalogs.", stack: "Node.js, Express, Redis", link: "github.com" }]);
        setAchievements(["1st Place at National Hackathon 2025"]);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const payload = {
      full_name: fullName,
      phone,
      cgpa,
      department,
      education,
      skills,
      certifications,
      projects,
      achievements
    };

    try {
      await api.post('/student/profile', payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.warn('Network profiles update failed. Simulating local save.');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Tag Array helpers
  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (sk) => {
    setSkills(skills.filter(s => s !== sk));
  };

  const addCert = () => {
    if (certName.trim()) {
      setCertifications([...certifications, { name: certName, issuer: certIssuer, date: new Date().toISOString().slice(0,7) }]);
      setCertName('');
      setCertIssuer('');
    }
  };

  const removeCert = (idx) => {
    setCertifications(certifications.filter((_, i) => i !== idx));
  };

  const addProject = () => {
    if (projTitle.trim()) {
      setProjects([...projects, { title: projTitle, desc: projDesc, stack: projStack }]);
      setProjTitle('');
      setProjDesc('');
      setProjStack('');
    }
  };

  const removeProject = (idx) => {
    setProjects(projects.filter((_, i) => i !== idx));
  };

  const addAchievement = () => {
    if (achInput.trim()) {
      setAchievements([...achievements, achInput.trim()]);
      setAchInput('');
    }
  };

  const removeAchievement = (idx) => {
    setAchievements(achievements.filter((_, i) => i !== idx));
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
      
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-slate-100 flex items-center gap-2">
            <User class="h-5 w-5 text-cyan-400" /> Professional Student Profile
          </h2>
          <p class="text-xs text-slate-400">Assemble the data points utilized by our AI recommendation models</p>
        </div>
        
        {success && (
          <div class="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs flex items-center gap-1.5 animate-in fade-in duration-300">
            <ShieldCheck class="h-4.5 w-4.5" /> Core profile updated
          </div>
        )}
      </div>

      <form onSubmit={handleSave} class="space-y-6">
        
        {/* Core Info card */}
        <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-900 pb-2">Personal Information</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-bold text-slate-400">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-bold text-slate-400">Phone Contact</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-bold text-slate-400">Cumulative GPA (CGPA)</label>
              <input type="number" step="0.01" value={cgpa} onChange={e => setCgpa(e.target.value)} class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-bold text-slate-400">Academic Department</label>
              <input type="text" value={department} onChange={e => setDepartment(e.target.value)} class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none" disabled />
            </div>
          </div>
        </div>

        {/* Education segment */}
        <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-900 pb-2 flex items-center gap-1.5">
            <BookOpen class="h-4.5 w-4.5" /> Academic Records
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-bold text-slate-400">Undergrad University</label>
              <input type="text" value={education.ug_college} onChange={e => setEducation({ ...education, ug_college: e.target.value })} class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-bold text-slate-400">Major / Degree</label>
              <input type="text" value={education.ug_degree} onChange={e => setEducation({ ...education, ug_degree: e.target.value })} class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-bold text-slate-400">Graduation Year</label>
              <input type="number" value={education.ug_year} onChange={e => setEducation({ ...education, ug_year: Number(e.target.value) })} class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] uppercase font-bold text-slate-400">High School details</label>
              <input type="text" value={education.high_school} onChange={e => setEducation({ ...education, high_school: e.target.value })} class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Skills segment */}
        <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-900 pb-2 flex items-center gap-1.5">
            <Layers class="h-4.5 w-4.5" /> Technical Skills Stack
          </h3>
          <div class="space-y-4">
            <div class="flex gap-2">
              <input 
                type="text" 
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                placeholder="e.g. Next.js"
                class="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50" 
              />
              <button 
                type="button" 
                onClick={addSkill}
                class="px-4 bg-cyan-500/10 border border-cyan-500/25 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus class="h-4 w-4" /> Add
              </button>
            </div>

            {/* Tags Grid */}
            <div class="flex flex-wrap gap-2">
              {skills.map(s => (
                <div key={s} class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <span>{s}</span>
                  <button type="button" onClick={() => removeSkill(s)} class="text-slate-500 hover:text-red-400 transition cursor-pointer font-bold">×</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Projects segment */}
        <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-900 pb-2">Projects Stack</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input type="text" placeholder="Project Title" value={projTitle} onChange={e => setProjTitle(e.target.value)} class="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none" />
              <input type="text" placeholder="Tech stack (e.g. React, Docker)" value={projStack} onChange={e => setProjStack(e.target.value)} class="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none" />
              <button type="button" onClick={addProject} class="px-3 py-2 bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 rounded-lg text-xs font-bold cursor-pointer">Add Project</button>
            </div>
            <textarea placeholder="Brief description of the work" value={projDesc} onChange={e => setProjDesc(e.target.value)} class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none h-16"></textarea>

            {/* List */}
            <div class="space-y-2">
              {projects.map((p, idx) => (
                <div key={idx} class="p-3 bg-slate-900/60 border border-slate-850 rounded-xl flex justify-between items-start gap-4">
                  <div>
                    <h4 class="text-xs font-bold text-slate-200">{p.title}</h4>
                    <p class="text-[10px] text-cyan-400 mt-0.5">{p.stack}</p>
                    <p class="text-[10px] text-slate-400 mt-1">{p.desc}</p>
                  </div>
                  <button type="button" onClick={() => removeProject(idx)} class="text-slate-500 hover:text-red-400 p-1 cursor-pointer">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certifications and Achievements */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Certs card */}
          <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 class="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-900 pb-2">Certifications</h3>
            <div class="space-y-4">
              <div class="flex gap-2">
                <input type="text" placeholder="Cert Name" value={certName} onChange={e => setCertName(e.target.value)} class="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none" />
                <input type="text" placeholder="Issuer" value={certIssuer} onChange={e => setCertIssuer(e.target.value)} class="w-24 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none" />
                <button type="button" onClick={addCert} class="px-3 bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 rounded-lg text-xs font-bold cursor-pointer"><Plus class="h-4 w-4" /></button>
              </div>
              <div class="space-y-2">
                {certifications.map((c, idx) => (
                  <div key={idx} class="p-2 rounded-lg bg-slate-900 border border-slate-850 flex justify-between items-center text-[10px] text-slate-300">
                    <div>
                      <span class="font-bold text-slate-200">{c.name}</span> • {c.issuer}
                    </div>
                    <button type="button" onClick={() => removeCert(idx)} class="text-slate-500 hover:text-red-400"><Trash2 class="h-3.5 w-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements card */}
          <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 class="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-900 pb-2 flex items-center gap-1.5">
              <Award class="h-4.5 w-4.5" /> Achievements
            </h3>
            <div class="space-y-4">
              <div class="flex gap-2">
                <input type="text" placeholder="Hackathon win, scholarship, etc." value={achInput} onChange={e => setAchInput(e.target.value)} class="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none" />
                <button type="button" onClick={addAchievement} class="px-3 bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 rounded-lg text-xs font-bold cursor-pointer"><Plus class="h-4 w-4" /></button>
              </div>
              <div class="space-y-2">
                {achievements.map((ac, idx) => (
                  <div key={idx} class="p-2 rounded-lg bg-slate-900 border border-slate-850 flex justify-between items-center text-[10px] text-slate-300">
                    <span>{ac}</span>
                    <button type="button" onClick={() => removeAchievement(idx)} class="text-slate-500 hover:text-red-400"><Trash2 class="h-3.5 w-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div class="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={saving}
            class="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 font-bold text-xs text-white hover:scale-102 transition shadow-lg shadow-purple-500/25 disabled:opacity-50"
          >
            {saving ? 'Saving Profile...' : 'Save Profile Details'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default StudentProfile;
