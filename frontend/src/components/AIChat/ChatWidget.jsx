import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, RefreshCw } from 'lucide-react';
import api from '../../services/api';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am your AI Copilot. Ask me anything about placements, interview prep, or resume ATS optimization!' }
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
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await api.post('/ai/chatbot', { message: text });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.content }]);
    } catch (err) {
      // Offline fallback
      setTimeout(() => {
        let reply = "Here's a quick AI recommendation: optimize your project descriptions using action verbs and concrete metrics (e.g. 'boosted speeds by 30%').";
        if (text.toLowerCase().includes('resume')) {
          reply = "Resume checklist: 1. Keep it one page. 2. Remove fancy templates/images. 3. Include skills relevant to job targets. 4. Use reverse-chronological order.";
        } else if (text.toLowerCase().includes('interview')) {
          reply = "To practice, ask me to start a mock interview, or review standard technical questions on arrays, hooks, and SQL joins.";
        }
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      }, 500);
    } finally {
      setIsTyping(false);
    }
  };

  const chips = [
    "ATS resume tips",
    "Prepare for coding round",
    "Mock questions",
    "Backend roadmap"
  ];

  return (
    <div class="fixed bottom-6 right-6 z-50">
      {/* Glow Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          class="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 shadow-xl text-white font-medium hover:scale-105 active:scale-95 transition-all duration-300 neon-glow-purple border border-cyan-400/20 group"
        >
          <Sparkles class="h-5 w-5 animate-pulse text-cyan-200 group-hover:rotate-12 transition-transform" />
          <span>Ask AI Copilot</span>
        </button>
      )}

      {/* Expanded Chat Dialog */}
      {isOpen && (
        <div class="w-80 sm:w-96 h-[480px] rounded-2xl border border-slate-800 bg-slate-950 flex flex-col shadow-2xl glass-card relative overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
          
          {/* Header */}
          <div class="p-3 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border-b border-slate-800 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <div class="p-1 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Bot class="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  Nexus AI assistant
                  <span class="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </h4>
                <p class="text-[9px] text-slate-400">Instant Placement Support</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              class="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          {/* Conversation list */}
          <div class="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                class={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {m.role === 'assistant' && (
                  <div class="h-6 w-6 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Bot class="h-3.5 w-3.5" />
                  </div>
                )}
                <div 
                  class={`p-3 rounded-2xl text-xs leading-relaxed border ${
                    m.role === 'user' 
                      ? 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-tr-none border-cyan-500/20' 
                      : 'bg-slate-900/60 text-slate-300 rounded-tl-none border-slate-800'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div class="flex gap-2 max-w-[85%]">
                <div class="h-6 w-6 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <Bot class="h-3.5 w-3.5" />
                </div>
                <div class="p-3 bg-slate-900/60 rounded-2xl rounded-tl-none border border-slate-800 flex items-center gap-1">
                  <span class="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                  <span class="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce delay-100"></span>
                  <span class="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            
            <div ref={scrollRef}></div>
          </div>

          {/* Prompt chips */}
          {messages.length === 1 && (
            <div class="p-3 border-t border-slate-900/40 bg-slate-950/20">
              <p class="text-[10px] text-slate-400 mb-1.5 font-medium">Quick starters:</p>
              <div class="flex flex-wrap gap-1.5">
                {chips.map(chip => (
                  <button 
                    key={chip} 
                    onClick={() => handleSend(chip)}
                    class="text-[10px] px-2 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-400 transition cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form input */}
          <div class="p-3 border-t border-slate-900 bg-slate-950/60">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              class="flex gap-2"
            >
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about resumes, DSA prep..." 
                class="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
              />
              <button 
                type="submit"
                class="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-500 text-white hover:scale-105 active:scale-95 transition"
              >
                <Send class="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};

export default ChatWidget;
