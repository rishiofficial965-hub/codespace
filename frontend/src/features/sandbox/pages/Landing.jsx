import React from 'react';
import { Play, Loader2, Activity } from 'lucide-react';
import { useSandbox } from '../hook/useSandbox';

export default function Landing() {
  const { startSandbox, status, creationStatus } = useSandbox();

  const handleStartSandbox = async () => {
    await startSandbox();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-6 relative overflow-hidden select-none">
      {/* Holographic glowing grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full"></div>
      
      <div className="z-10 text-center max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/20 text-indigo-400 text-xs font-semibold mb-6 animate-pulse uppercase tracking-wider">
          <Activity size={12} className="text-indigo-400" />
          Cloud Sandboxes Ready
        </div>
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-50 via-indigo-200 to-indigo-500 tracking-tight leading-tight">
          Antigravity Cloud IDE
        </h1>
        <p className="mt-4 text-slate-400 text-base leading-relaxed font-sans">
          Create an isolated React sandbox environment in seconds. Code, preview in real time, and let our autonomous AI developer build your components instantly.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center min-h-[140px]">
          {status === 'creating' ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
              <div className="text-sm font-mono text-indigo-300 animate-pulse">
                {creationStatus}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={handleStartSandbox}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium rounded-xl shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_0_35px_-2px_rgba(99,102,241,0.7)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer animate-none"
              >
                <Play className="fill-white group-hover:scale-110 transition-transform" size={18} />
                Initialize Dev Sandbox
              </button>
              {status === 'error' && (
                <div className="text-rose-400 text-xs font-mono mt-2 bg-rose-950/20 px-3 py-1 rounded border border-rose-900/30">
                  {creationStatus}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 text-xs text-slate-600 font-mono">
        Antigravity Engine v2.4 • Kubernetes-backed Isolated Workspace
      </div>
    </div>
  );
}
