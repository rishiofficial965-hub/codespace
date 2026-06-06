import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Globe, 
  RefreshCw, 
  ExternalLink, 
  Maximize2, 
  Save, 
  Loader2, 
  FileText, 
  X,
  Keyboard
} from 'lucide-react';
import { useSandbox } from '../hook/useSandbox';

export default function WorkspaceCenter() {
  const {
    sandboxId,
    selectedFile,
    fileContent,
    fileLoading,
    fileSaving,
    previewKey,
    saveFile,
    handleSetFileContent,
    handleSetSelectedFile,
    handleIncrementPreviewKey
  } = useSandbox();

  const [activeTab, setActiveTab] = useState('branding'); // 'branding' | 'editor' | 'preview'
  const [fullscreenPreview, setFullscreenPreview] = useState(false);

  const previewUrl = sandboxId ? `http://${sandboxId}.preview.localhost` : '';

  // Auto-switch tabs when a file is selected
  useEffect(() => {
    if (selectedFile) {
      setActiveTab('editor');
    }
  }, [selectedFile]);

  // Handle keyboard shortcut for saving (Ctrl + S)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (selectedFile && activeTab === 'editor') {
          handleSaveFile();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFile, fileContent, activeTab]);

  const handleSaveFile = async () => {
    await saveFile(selectedFile, fileContent);
  };

  const handleCloseFile = () => {
    handleSetSelectedFile(null);
    setActiveTab('branding');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0d1117] overflow-hidden relative border-r border-white/[0.06]">
      
      {/* Top Header Tab Bar */}
      <div className="h-9 border-b border-white/[0.06] bg-[#0d1117] flex items-center justify-between px-3 select-none shrink-0 z-10">
        <div className="flex items-center gap-1 h-full">
          {/* Branding Tab */}
          <button
            onClick={() => setActiveTab('branding')}
            className={`h-full px-3 flex items-center gap-1.5 text-[11px] font-sans border-b-2 transition cursor-pointer ${
              activeTab === 'branding'
                ? 'border-blue-500 text-blue-400 font-semibold bg-white/[0.02]'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Keyboard size={12} />
            Start Page
          </button>

          {/* Active File Editor Tab */}
          {selectedFile && (
            <div
              className={`h-full flex items-center border-b-2 group transition ${
                activeTab === 'editor'
                  ? 'border-blue-500 text-blue-400 font-semibold bg-white/[0.02]'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <button
                onClick={() => setActiveTab('editor')}
                className="h-full pl-3 pr-1.5 flex items-center gap-1.5 text-[11px] font-sans cursor-pointer"
              >
                <Code size={12} />
                <span className="max-w-[120px] truncate">{selectedFile.split('/').pop()}</span>
              </button>
              <button 
                onClick={handleCloseFile}
                className="mr-2 p-0.5 rounded-full hover:bg-slate-800 text-slate-500 hover:text-slate-200 transition shrink-0 cursor-pointer"
              >
                <X size={10} />
              </button>
            </div>
          )}

          {/* Web Preview Tab */}
          <button
            onClick={() => setActiveTab('preview')}
            className={`h-full px-3 flex items-center gap-1.5 text-[11px] font-sans border-b-2 transition cursor-pointer ${
              activeTab === 'preview'
                ? 'border-blue-500 text-blue-400 font-semibold bg-white/[0.02]'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Globe size={12} />
            Web Preview
          </button>
        </div>

        {/* Tab-specific quick controls */}
        <div className="flex items-center gap-2">
          {activeTab === 'editor' && selectedFile && (
            <button
              onClick={handleSaveFile}
              disabled={fileSaving || fileLoading}
              className="flex items-center gap-1 px-2.5 py-0.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-[10px] text-white rounded font-sans transition cursor-pointer shadow-md shadow-blue-600/10"
              title="Save File (Ctrl + S)"
            >
              {fileSaving ? (
                <Loader2 size={10} className="animate-spin" />
              ) : (
                <Save size={10} />
              )}
              {fileSaving ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 min-h-0 relative overflow-hidden bg-[#0d1117]">
        
        {/* BRANDING TAB CONTENT */}
        {activeTab === 'branding' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 select-none p-6 z-0">
            {/* Holographic Glowing SVG Logo */}
            <div className="relative mb-6 group">
              <div className="absolute inset-0 bg-blue-500/10 blur-[40px] rounded-full group-hover:bg-blue-500/20 transition-all duration-500"></div>
              {/* Stylized Antigravity custom white logo */}
              <svg className="w-16 h-16 text-slate-100 relative z-10 transition-transform duration-500 hover:scale-105" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 15L85 80H70L50 42L30 80H15L50 15Z" />
                <circle cx="50" cy="62" r="6" fill="#3b82f6" className="animate-pulse" />
              </svg>
            </div>
            
            <h1 className="text-xl font-bold text-slate-100 tracking-tight font-sans">Antigravity IDE</h1>
            <p className="text-xs text-slate-400 mt-1 font-sans">Autonomous AI Developer Cloud Workspace</p>
            
            <div className="mt-8 flex flex-col items-center gap-2">
              <button 
                onClick={() => {
                  // Focus the chat input box trigger
                  const chatInput = document.getElementById('ai-chat-input');
                  if (chatInput) chatInput.focus();
                }}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/[0.06] hover:border-white/[0.12] rounded-lg text-slate-300 hover:text-white text-xs font-sans font-medium transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                Code with Agent
              </button>
              <div className="flex items-center gap-1 mt-4 text-[10px] text-slate-500 font-sans">
                <span>Toggle Chat Panel</span>
                <span className="px-1.5 py-0.5 bg-slate-900 border border-white/[0.06] rounded font-mono text-[9px]">Ctrl</span>
                <span>+</span>
                <span className="px-1.5 py-0.5 bg-slate-900 border border-white/[0.06] rounded font-mono text-[9px]">L</span>
              </div>
            </div>
          </div>
        )}

        {/* CODE EDITOR TAB CONTENT */}
        {activeTab === 'editor' && selectedFile && (
          <div className="absolute inset-0 flex flex-col">
            {fileLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 select-none text-slate-500 text-xs font-sans">
                <Loader2 size={20} className="animate-spin text-blue-500" />
                <span>Loading file content...</span>
              </div>
            ) : (
              <div className="flex-1 flex overflow-hidden relative">
                {/* Visual Line Numbers */}
                <div className="w-10 bg-slate-950/30 border-r border-white/[0.02] py-4 text-right pr-2.5 text-[10px] font-mono text-slate-600 select-none space-y-1">
                  {fileContent.split('\n').map((_, index) => (
                    <div key={index} className="h-5 leading-5">{index + 1}</div>
                  ))}
                </div>
                <textarea
                  value={fileContent}
                  onChange={(e) => handleSetFileContent(e.target.value)}
                  className="flex-1 p-4 bg-transparent text-slate-300 font-mono text-xs leading-5 border-none outline-none resize-none scrollbar-ide"
                  placeholder="// Type code here..."
                  spellCheck="false"
                />
              </div>
            )}
            
            {/* Editor Footer / Info */}
            <div className="h-6 border-t border-white/[0.06] bg-slate-950/20 px-3 flex items-center justify-between text-[9px] text-slate-500 font-mono shrink-0 select-none">
              <span>Lines: {fileContent.split('\n').length}</span>
              <span className="text-[10px] text-slate-400 bg-white/[0.03] px-1.5 py-0.5 rounded uppercase font-bold">UTF-8</span>
            </div>
          </div>
        )}

        {/* WEB PREVIEW TAB CONTENT */}
        {activeTab === 'preview' && (
          <div className={`absolute inset-0 flex flex-col bg-[#0d1117] ${
            fullscreenPreview ? 'fixed inset-0 z-50 p-4 bg-slate-950' : ''
          }`}>
            
            {/* Browser Chrome Address Bar Row */}
            <div className="h-9 border-b border-white/[0.06] bg-slate-900/40 flex items-center justify-between px-3 select-none shrink-0 gap-3">
              <div className="flex items-center gap-1">
                {/* Address controls */}
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/30"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/30"></div>
              </div>
              
              {/* URL Address Box */}
              <div className="flex-1 max-w-md bg-slate-950 border border-white/[0.06] rounded-md px-3 py-0.5 text-[11px] text-slate-400 font-mono truncate select-all flex items-center justify-between gap-2 shadow-inner">
                <span className="truncate">{previewUrl || 'about:blank'}</span>
                <Globe size={10} className="text-slate-600 shrink-0" />
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
                <button 
                  onClick={handleIncrementPreviewKey}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
                  title="Reload Live Server"
                >
                  <RefreshCw size={11} />
                </button>
                {previewUrl && (
                  <a 
                    href={previewUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition inline-flex items-center cursor-pointer"
                    title="Open in new window"
                  >
                    <ExternalLink size={11} />
                  </a>
                )}
                <button 
                  onClick={() => setFullscreenPreview(!fullscreenPreview)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
                  title="Toggle Fullscreen"
                >
                  <Maximize2 size={11} />
                </button>
                {fullscreenPreview && (
                  <button 
                    onClick={() => setFullscreenPreview(false)}
                    className="ml-1 px-1.5 py-0.5 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded text-[9px] font-sans transition cursor-pointer"
                  >
                    Exit Fullscreen
                  </button>
                )}
              </div>
            </div>

            {/* Iframe View */}
            <div className="flex-1 bg-white relative">
              {previewUrl ? (
                <iframe
                  key={previewKey}
                  src={previewUrl}
                  title="Live Preview Screen"
                  className="w-full h-full border-none bg-white"
                  sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts"
                />
              ) : (
                <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-slate-500 text-xs font-mono select-none">
                  <Loader2 size={18} className="animate-spin text-blue-500 mb-2" />
                  <span>Loading local dev server...</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
