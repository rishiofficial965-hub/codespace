import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  GitBranch, 
  RefreshCw, 
  AlertCircle, 
  AlertTriangle, 
  Settings, 
  Sliders,
  HelpCircle
} from 'lucide-react';
import Header from './Header';
import AiChat from './AiChat';
import WorkspaceCenter from './WorkspaceCenter';
import TerminalPanel from './TerminalPanel';
import FileExplorer from './FileExplorer';
import { setSandboxId } from '../state/sandboxSlice';

export default function WorkspaceLayout() {
  const dispatch = useDispatch();
  const { sandboxId } = useParams();

  // Sync the sandboxId from the URL params into Redux store
  useEffect(() => {
    if (sandboxId) {
      dispatch(setSandboxId(sandboxId));
    }
  }, [sandboxId, dispatch]);

  return (
    <div className="h-screen bg-[#0d1117] text-[#e5e7eb] flex flex-col overflow-hidden font-sans select-none antialiased">
      
      {/* 1. TOP BAR IDE HEADER */}
      <Header />

      {/* 2. MAIN RESIZABLE IDE COLUMNS AND PANES */}
      <main className="flex-1 flex overflow-hidden min-h-0 relative">
        
        {/* LEFT COLUMN: FILE EXPLORER SIDEBAR */}
        <section className="w-[240px] shrink-0 flex flex-col overflow-hidden">
          <FileExplorer />
        </section>

        {/* CENTER COLUMN: ACTIVE EDITOR & TERMINALS */}
        <section className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          
          {/* TOP AREA: EDITOR & BROWSER PREVIEW */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
            <WorkspaceCenter />
          </div>
          
          {/* BOTTOM AREA: PROBLEMS, PORTMAPS & TERMINALS */}
          <TerminalPanel />
          
        </section>

        {/* RIGHT COLUMN: AI CHAT ASSISTANT SIDEBAR */}
        <section className="w-[320px] shrink-0 flex flex-col overflow-hidden">
          <AiChat />
        </section>

      </main>

      {/* 3. BOTTOM IDE STATUS BAR */}
      <footer className="h-5.5 border-t border-white/[0.06] bg-[#0a0f14] px-3 flex items-center justify-between text-[10px] text-slate-500 font-mono select-none shrink-0 z-20">
        
        {/* Left Status Bar details: Git, sync state, and error logs */}
        <div className="flex items-center gap-3">
          {/* Git branch node */}
          <div className="flex items-center gap-1 hover:text-slate-300 transition cursor-pointer">
            <GitBranch size={11} className="text-slate-500" />
            <span>main*</span>
          </div>

          {/* Sync indicator */}
          <button 
            onClick={() => dispatch(setSandboxId(sandboxId))} 
            className="hover:text-slate-300 transition cursor-pointer flex items-center"
            title="Synchronize workspace status"
          >
            <RefreshCw size={9} className="text-slate-500" />
          </button>

          {/* Git alerts */}
          <div className="flex items-center gap-2 border-l border-white/[0.04] pl-3 text-slate-500 select-none">
            <div className="flex items-center gap-0.5 hover:text-red-400 transition cursor-pointer" title="Problems detected">
              <AlertCircle size={10} className="text-slate-600" />
              <span>0</span>
            </div>
            <div className="flex items-center gap-0.5 hover:text-yellow-400 transition cursor-pointer" title="Warnings detected">
              <AlertTriangle size={10} className="text-slate-600" />
              <span>0</span>
            </div>
          </div>
        </div>

        {/* Right Status Bar details: Antigravity - Settings clickable and help config */}
        <div className="flex items-center gap-3.5">
          {/* Configuration mode */}
          <div className="flex items-center gap-1 select-none">
            <Sliders size={9} className="text-slate-600" />
            <span>Gemini Mode</span>
          </div>

          {/* Settings node - matching the screenshot exactly! */}
          <a 
            href="#settings"
            onClick={(e) => {
              e.preventDefault();
              alert('Opening Antigravity settings configuration dialog...');
            }}
            className="flex items-center gap-1 hover:text-slate-300 transition cursor-pointer font-sans"
          >
            <Settings size={10} className="text-slate-500" />
            <span>Antigravity - Settings</span>
          </a>

          {/* Help */}
          <HelpCircle size={10} className="text-slate-500 hover:text-slate-300 transition cursor-pointer" title="IDE Documentation" />
        </div>

      </footer>

    </div>
  );
}
