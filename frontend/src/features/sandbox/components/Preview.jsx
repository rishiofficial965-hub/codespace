import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { incrementPreviewKey } from '../state/sandboxSlice';

export default function Preview() {
  const dispatch = useDispatch();
  const sandboxId = useSelector((state) => state.sandbox.sandboxId);
  const previewKey = useSelector((state) => state.sandbox.previewKey);

  const previewUrl = sandboxId ? `http://${sandboxId}.preview.localhost` : '';

  return (
    <div className="h-[55%] border-b border-slate-900 flex flex-col bg-slate-950 relative">
      <div className="h-10 border-b border-slate-800/50 bg-slate-900/60 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <span className="text-slate-500 text-[10px] uppercase font-mono tracking-wide font-semibold select-none">Web Preview</span>
          <div className="flex-1 bg-slate-950 border border-slate-800/60 rounded-md px-2.5 py-0.5 text-xs text-slate-400 font-mono truncate select-all">
            {previewUrl || 'about:blank'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => dispatch(incrementPreviewKey())}
            className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition cursor-pointer"
            title="Reload Preview"
          >
            <RefreshCw size={13} />
          </button>
          {previewUrl && (
            <a 
              href={previewUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition inline-flex items-center"
              title="Open in new window"
            >
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>

      <div className="flex-1 bg-white relative">
        {previewUrl ? (
          <iframe
            key={previewKey}
            src={previewUrl}
            title="Sandbox Live Preview"
            className="w-full h-full border-none bg-white"
            sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-950 flex items-center justify-center text-slate-600 text-xs font-mono">
            Loading preview server...
          </div>
        )}
      </div>
    </div>
  );
}
