import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RefreshCw, Trash2, ShieldCheck, Sparkles, Terminal, Activity, HelpCircle } from 'lucide-react';
import { destroySandbox, incrementPreviewKey } from '../state/sandboxSlice';
import { resetChat } from '../state/chatSlice';
import { resetUi } from '../state/uiSlice';

export default function Header() {
  const dispatch = useDispatch();
  const sandboxId = useSelector((state) => state.sandbox.sandboxId);

  const handleDestroySandbox = () => {
    if (confirm('Are you sure you want to release the sandbox? This will clear your current local session.')) {
      dispatch(destroySandbox());
      dispatch(resetChat());
      dispatch(resetUi());
    }
  };

  return (
    <header className="h-9 border-b border-white/[0.06] bg-[#0a0f14] px-3 flex items-center justify-between z-20 shrink-0 select-none">
      
      {/* Left side: IDE logo & details */}
      <div className="flex items-center gap-3">
        {/* Antigravity SVG white logo */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-white" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 15L85 80H70L50 42L30 80H15L50 15Z" />
          </svg>
          <span className="font-semibold text-slate-100 tracking-wide text-[11px] font-sans">Antigravity IDE</span>
        </div>
        <span className="text-white/[0.04] text-xs">|</span>
        
        {/* Folder tag */}
        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-sans">
          <span>workspace:</span>
          <span className="text-slate-300 font-semibold bg-white/[0.02] border border-white/[0.04] px-1.5 py-0.5 rounded">capstone</span>
        </div>
      </div>

      {/* Center side: Global search placeholder */}
      <div className="flex-1 max-w-sm mx-4 bg-slate-950/60 hover:bg-slate-950 border border-white/[0.04] hover:border-white/[0.08] rounded-md px-3 py-1 text-[10px] text-slate-500 font-sans flex items-center justify-between transition cursor-pointer select-none">
        <span>Search files, commands, or ask AI agent...</span>
        <div className="flex items-center gap-0.5 font-mono text-[8px] text-slate-600 bg-white/[0.01] border border-white/[0.04] px-1 rounded">
          <span>Ctrl</span>
          <span>+</span>
          <span>P</span>
        </div>
      </div>

      {/* Right side: AI and Connection Status */}
      <div className="flex items-center gap-3">
        {/* Connection status node */}
        <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-md px-2 py-0.5 text-[9px] text-green-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)] animate-pulse"></span>
          <span>CONNECTED</span>
        </div>

        {/* AI Orchestrator service count */}
        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-sans">
          <Activity size={10} className="text-slate-600" />
          <span>Services:</span>
          <span className="text-slate-300 font-bold bg-white/[0.02] px-1 rounded">3/3</span>
        </div>

        <div className="flex items-center gap-1.5 border-l border-white/[0.08] pl-3">
          <button 
            onClick={() => dispatch(incrementPreviewKey())}
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-sans font-medium text-slate-300 hover:text-white bg-slate-900 border border-white/[0.04] hover:border-white/[0.08] rounded transition cursor-pointer"
            title="Reload Preview"
          >
            <RefreshCw size={10} />
            <span>Reload</span>
          </button>
          
          <button
            onClick={handleDestroySandbox}
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-sans font-medium text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 hover:border-red-900/50 rounded transition cursor-pointer"
            title="Release Sandbox Container"
          >
            <Trash2 size={10} />
            <span>Exit</span>
          </button>
        </div>
      </div>

    </header>
  );
}
