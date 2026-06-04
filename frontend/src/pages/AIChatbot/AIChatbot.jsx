import React, { useState, useRef, useEffect } from 'react';
import api from '../../services/api';
import { Send, Bot, Sparkles, MessageSquareCode, Award, ArrowUpRight, HelpCircle } from 'lucide-react';

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to your Nexus AI Career Mentor portal! I am trained on hundreds of tech recruiter guides and interview outlines. Select a preset template query below, or write your query to get roadmaps, mock questions, or resume reviews.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await api.post('/ai/chatbot', { message: text });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.content }]);
    } catch (err) {
      // Simulation offline fallback
      setTimeout(() => {
        let reply = `Here's your custom guidance based on "${text}":\n\nTo prepare for software development placements, organize your portfolio into 3 projects: 1. Core Framework CRUD, 2. Optimized database backend (Redis/SQL indexes), 3. Containerized microservice (Docker). Drill basic algorithms daily.`;
        if (text.toLowerCase().includes('react')) {
          reply = "React interview checklist: 1. Virtual DOM rendering vs standard DOM. 2. Custom hooks design pattern. 3. React 19 actions support. 4. Code splitting with lazy components.";
        } else if (text.toLowerCase().includes('roadmap')) {
          reply = "Full-Stack roadmap: 1. CSS grid/flexbox, JavaScript logic. 2. React UI structures. 3. Node/Express routing, JWT token auth, MySQL schemas. 4. Docker deployments, unit testing configurations.";
        }
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      }, 700);
    } finally {
      setIsTyping(false);
    }
  };

  const templates = [
    { title: "Generate React mock questions", query: "Give me 3 React technical mock questions with categories" },
    { title: "Node.js backend checklist", query: "What are the core technical concepts tested in Node/Express interviews?" },
    { title: "Create action verb resume bullet", query: "Rewrite my project bullet: 'I built an API and hooked it to the database' to sound professional" },
    { title: "HR conflict resolution tips", query: "Generate standard HR behavioral mock questions on conflict resolution" }
  ];

  return (
    <div class="h-[calc(100vh-8rem)] flex flex-col glass-card border border-slate-800 rounded-2xl overflow-hidden relative">
      
      {/* Header */}
      <div class="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <MessageSquareCode class="h-5 w-5" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              AI Placement Coach
              <span class="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h3>
            <p class="text-[10px] text-slate-400 font-medium">Real-Time Career Roadmaps & Interview Prep</p>
          </div>
        </div>

        <div class="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-300 text-[10px] font-bold">
          <Sparkles class="h-3.5 w-3.5" /> High-Fidelity Advisor Mode
        </div>
      </div>

      {/* Messages */}
      <div class="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, idx) => (
          <div 
            key={idx} 
            class={`flex gap-3 max-w-[80%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {m.role === 'assistant' ? (
              <div class="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg">
                <Bot class="h-4.5 w-4.5" />
              </div>
            ) : (
              <div class="h-8 w-8 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300 shrink-0">
                U
              </div>
            )}
            
            <div 
              class={`p-4 rounded-2xl text-xs leading-relaxed border space-y-2 whitespace-pre-line ${
                m.role === 'user' 
                  ? 'bg-gradient-to-tr from-cyan-600 to-cyan-700 text-white border-cyan-500/20 rounded-tr-none shadow-md shadow-cyan-500/5' 
                  : 'bg-slate-900/50 text-slate-300 border-slate-800 rounded-tl-none'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div class="flex gap-3 max-w-[80%]">
            <div class="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shrink-0">
              <Bot class="h-4.5 w-4.5" />
            </div>
            <div class="p-4 bg-slate-900/50 rounded-2xl rounded-tl-none border border-slate-850 flex items-center gap-1">
              <span class="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"></span>
              <span class="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce delay-100"></span>
              <span class="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce delay-200"></span>
            </div>
          </div>
        )}

        <div ref={scrollRef}></div>
      </div>

      {/* Suggested prompts list (if only welcome message) */}
      {messages.length === 1 && (
        <div class="p-6 border-t border-slate-900 bg-slate-950/20 grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
          {templates.map((temp, i) => (
            <button 
              key={i}
              onClick={() => handleSend(temp.query)}
              class="p-3.5 rounded-xl bg-slate-900 border border-slate-850 text-left text-slate-300 hover:border-cyan-500/30 hover:text-cyan-400 hover:bg-slate-900/50 transition duration-200 cursor-pointer flex justify-between items-center gap-2"
            >
              <div class="space-y-0.5">
                <span class="text-xs font-bold text-slate-200 block">{temp.title}</span>
                <span class="text-[10px] text-slate-500 block truncate max-w-[240px]">{temp.query}</span>
              </div>
              <ArrowUpRight class="h-4 w-4 shrink-0 text-slate-500" />
            </button>
          ))}
        </div>
      )}

      {/* Send Input */}
      <div class="p-4 border-t border-slate-900 bg-slate-950/60 shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          class="flex gap-3"
        >
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your query regarding DSA, Resume enhancements, or Interview feedback..." 
            class="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 placeholder-slate-500"
          />
          <button 
            type="submit"
            class="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 font-bold text-xs text-white hover:scale-102 active:scale-98 transition flex items-center gap-2 shadow-lg shadow-purple-500/10"
          >
            Send <Send class="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default AIChatbot;
