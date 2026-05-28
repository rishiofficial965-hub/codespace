import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Terminal as TermIcon, Folder, Plus } from 'lucide-react';
import Header from './Header';
import AiChat from './AiChat';
import Preview from './Preview';
import TerminalPanel from './TerminalPanel';
import FileExplorer from './FileExplorer';
import { setActiveTab, setIsCreatingFile } from '../state/uiSlice';
import { setSandboxId } from '../state/sandboxSlice';

export default function WorkspaceLayout() {
  const dispatch = useDispatch();
  const { sandboxId } = useParams();
  const activeTab = useSelector((state) => state.ui.activeTab);
  const isCreatingFile = useSelector((state) => state.ui.isCreatingFile);

  // Sync the sandboxId from the URL params into Redux store
  useEffect(() => {
    if (sandboxId) {
      dispatch(setSandboxId(sandboxId));
    }
  }, [sandboxId, dispatch]);

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans">
      <Header />

      <main className="flex-1 flex overflow-hidden">
        {/* Left Pane: AI Chat */}
        <AiChat />

        {/* Right Pane: Preview + Tabs */}
        <section className="flex-1 flex flex-col overflow-hidden">
          <Preview />

          {/* Bottom: Terminal & Explorer */}
          <div className="flex-1 flex flex-col bg-slate-900/20 overflow-hidden">
            {/* Tab Bar */}
            <div className="h-9 border-b border-slate-900 bg-slate-900/50 flex items-center px-4 justify-between select-none">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => dispatch(setActiveTab('terminal'))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-md text-xs font-mono transition cursor-pointer ${
                    activeTab === 'terminal'
                      ? 'bg-slate-950 text-indigo-400 border-t-2 border-indigo-500 font-semibold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <TermIcon size={12} />
                  Terminal
                </button>
                <button
                  onClick={() => dispatch(setActiveTab('explorer'))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-md text-xs font-mono transition cursor-pointer ${
                    activeTab === 'explorer'
                      ? 'bg-slate-950 text-indigo-400 border-t-2 border-indigo-500 font-semibold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Folder size={12} />
                  File Explorer
                </button>
              </div>

              {activeTab === 'explorer' && (
                <button 
                  onClick={() => dispatch(setIsCreatingFile(!isCreatingFile))}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition flex items-center gap-1 text-[10px] font-mono cursor-pointer"
                >
                  <Plus size={11} />
                  New File
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden relative bg-slate-950">
              <TerminalPanel />
              <FileExplorer />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
