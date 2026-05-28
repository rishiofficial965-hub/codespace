import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RefreshCw, Trash2 } from 'lucide-react';
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
    <header className="h-14 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md px-4 flex items-center justify-between z-20">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse"></span>
          <span className="font-semibold text-slate-200 tracking-wide text-sm font-mono select-none">ANTIGRAVITY_IDE</span>
        </div>
        <span className="text-slate-700 select-none">|</span>
        <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800/80 rounded-md px-2 py-0.5 text-xs text-slate-400 font-mono">
          <span>ID:</span>
          <span className="text-indigo-400 font-semibold">{sandboxId ? `${sandboxId.substring(0, 8)}...` : 'N/A'}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => dispatch(incrementPreviewKey())}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg transition cursor-pointer font-mono"
        >
          <RefreshCw size={12} />
          Hot Reload Preview
        </button>
        <button
          onClick={handleDestroySandbox}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/30 hover:border-rose-900/50 rounded-lg transition cursor-pointer font-mono"
        >
          <Trash2 size={12} />
          Exit Sandbox
        </button>
      </div>
    </header>
  );
}
