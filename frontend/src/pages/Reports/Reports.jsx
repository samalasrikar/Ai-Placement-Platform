import React, { useState } from 'react';
import api from '../../services/api';
import { FileDown, ShieldCheck, Download, Loader2 } from 'lucide-react';

const Reports = () => {
  const [reportType, setReportType] = useState('placement'); // student, recruiter, placement
  const [generating, setGenerating] = useState(false);
  const [logs, setLogs] = useState([]);
  const [createdReports, setCreatedReports] = useState([
    { fileName: 'placement_report_may2026.csv', type: 'placement', size: '24 KB', date: '2026-05-30' },
    { fileName: 'student_roster_june2026.csv', type: 'student', size: '12 KB', date: '2026-06-01' }
  ]);

  const startGeneration = () => {
    setGenerating(true);
    setLogs([]);

    const logLines = [
      "Accessing database records...",
      "Matching student details to recruiter applications...",
      "Joining companies names and positions metrics...",
      "Building CSV formatting schema structures...",
      "Dispatched secure CSV report file."
    ];

    let currentLogIdx = 0;
    const interval = setInterval(() => {
      if (currentLogIdx < logLines.length) {
        setLogs(prev => [...prev, logLines[currentLogIdx]]);
        currentLogIdx++;
      } else {
        clearInterval(interval);
        
        // Push generated report item
        const randName = `${reportType}_summary_${Date.now().toString().slice(-4)}.csv`;
        setCreatedReports(prev => [
          { fileName: randName, type: reportType, size: '18 KB', date: new Date().toISOString().slice(0, 10) },
          ...prev
        ]);
        setGenerating(false);
      }
    }, 400);
  };

  const triggerDownload = (report) => {
    // Generate mock CSV content client-side
    let csvContent = "data:text/csv;charset=utf-8,";
    if (report.type === 'placement') {
      csvContent += "Student Name,Roll No,Company Name,Job Role,Salary Package,Status\nAlex Carter,CS2023089,Google,Software Engineer,$120k LPA,Interview Scheduled\nJane Smith,EC2023041,Google,Software Engineer,$120k LPA,Applied";
    } else if (report.type === 'student') {
      csvContent += "Student Name,Roll No,Department,CGPA,Profile Competence\nAlex Carter,CS2023089,CS Engineering,9.15,85%\nJane Smith,EC2023041,ECE Engineering,8.42,70%";
    } else {
      csvContent += "Company Name,Recruiter,Email,Verified,Jobs Posted\nGoogle,Sarah Jenkins,recruiter@google.com,Yes,2\nMicrosoft,David Chen,recruiter@microsoft.com,Yes,1";
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", report.fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div class="space-y-6 max-w-4xl mx-auto">
      
      <div>
        <h2 class="text-xl font-bold text-slate-100 flex items-center gap-2">
          <FileDown class="h-5 w-5 text-cyan-400" /> Platform Reports Generator
        </h2>
        <p class="text-xs text-slate-400">Generate CSV exports detailing placement statistics, recruiter registers, and student database tables</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Generator form */}
        <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-900 pb-2">Generate Export</h3>
          
          <div class="space-y-1">
            <label class="text-[9px] uppercase font-bold text-slate-500">Target Database</label>
            <select 
              value={reportType} 
              onChange={e => setReportType(e.target.value)}
              class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-350 focus:outline-none"
            >
              <option value="placement">Placement Summary Report</option>
              <option value="student">Student Profiles Roster</option>
              <option value="recruiter">Recruiters Roster</option>
            </select>
          </div>

          <button 
            onClick={startGeneration}
            disabled={generating}
            class="w-full py-2 bg-gradient-to-r from-cyan-500 to-purple-600 font-bold text-xs text-white rounded-lg hover:scale-102 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md shadow-purple-500/10"
          >
            {generating ? (
              <>
                <Loader2 class="h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              'Generate CSV'
            )}
          </button>

          {/* Logs Terminal */}
          {logs.length > 0 && (
            <div class="p-3 bg-black/90 border border-slate-900 rounded-xl font-mono text-[9px] text-cyan-400/90 space-y-1 max-h-32 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} class="flex gap-1.5 items-start">
                  <span class="text-slate-600">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Existing reports roster (Col span 2) */}
        <div class="md:col-span-2 space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Available CSV Archives</h3>
          
          <div class="space-y-3">
            {createdReports.map((report, idx) => (
              <div 
                key={idx} 
                class="glass-card p-4 rounded-xl border border-slate-850 flex items-center justify-between gap-4 text-xs animate-in slide-in-from-top-2 duration-300"
              >
                <div>
                  <span class="font-bold text-slate-200 block truncate max-w-[200px]">{report.fileName}</span>
                  <span class="text-[9px] text-slate-500 mt-1 block uppercase font-semibold">
                    {report.type} • {report.size} • Created {report.date}
                  </span>
                </div>

                <button 
                  onClick={() => triggerDownload(report)}
                  class="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition cursor-pointer"
                  title="Download File"
                >
                  <Download class="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Reports;
