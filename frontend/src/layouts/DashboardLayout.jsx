import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import ChatWidget from '../components/AIChat/ChatWidget';
import { Menu, X } from 'lucide-react';

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div class="min-h-screen bg-bg-dark flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <div class="flex-1 flex relative">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          class="md:hidden fixed bottom-6 left-6 z-50 p-3 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 shadow-lg text-white hover:scale-105 active:scale-95 transition"
        >
          {mobileOpen ? <X class="h-6 w-6" /> : <Menu class="h-6 w-6" />}
        </button>

        {/* Mobile Overlay Sidebar */}
        {mobileOpen && (
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)}>
            <div class="w-64 bg-slate-950/95 h-full p-4 border-r border-slate-800" onClick={(e) => e.stopPropagation()}>
              <div class="h-12 border-b border-slate-800 flex items-center mb-6">
                <span class="font-bold text-cyan-400">NEXUS AI NAV</span>
              </div>
              {/* Sidebar gets loaded here */}
              <Sidebar />
            </div>
          </div>
        )}

        {/* Page Content Panel */}
        <main class="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>

      {/* Floating AI Chatbot Button */}
      <ChatWidget />
    </div>
  );
};

export default DashboardLayout;
