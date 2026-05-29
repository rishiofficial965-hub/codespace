import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { 
  Plus, 
  Terminal as TermIcon, 
  Trash2, 
  Columns, 
  Layout, 
  Maximize2, 
  X,
  Play,
  Settings,
  Link,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import 'xterm/css/xterm.css';
import { agentSocketOrigin, agentSocketPath } from '../../../config';

export default function TerminalPanel() {
  const sandboxId = useSelector((state) => state.sandbox.sandboxId);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('terminal'); // 'problems' | 'output' | 'debug' | 'terminal' | 'ports'
  const [terminalInstances, setTerminalInstances] = useState(['pwsh', 'pwsh']);
  const [selectedInstanceIndex, setSelectedInstanceIndex] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);

  const terminalRef = useRef(null);
  const xtermInstance = useRef(null);
  const socketInstance = useRef(null);

  // Initialize Terminal WebSocket stream on mount / tab change
  useEffect(() => {
    if (sandboxId && activeTab === 'terminal' && terminalRef.current) {
      const timer = setTimeout(() => {
        initTerminal();
      }, 200);
      return () => {
        clearTimeout(timer);
        destroyTerminal();
      };
    }
  }, [sandboxId, activeTab, selectedInstanceIndex]);

  const initTerminal = () => {
    destroyTerminal();

    const socket = io(agentSocketOrigin(sandboxId), {
      path: agentSocketPath(sandboxId),
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });
    socketInstance.current = socket;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 12,
      fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      theme: {
        background: '#090d16',
        foreground: '#e2e8f0',
        cursor: '#3b82f6',
        selectionBackground: 'rgba(59, 130, 246, 0.3)',
      },
    });
    xtermInstance.current = term;

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    const handleResize = () => {
      try {
        fitAddon.fit();
      } catch (err) {
        // Safe catches for hidden containers
      }
    };
    window.addEventListener('resize', handleResize);
    term.userData = { handleResize };

    socket.on('connect', () => {
      term.write(`\r\n\x1b[32m=== Connected to Antigravity shell [Instance #${selectedInstanceIndex + 1}] ===\x1b[0m\r\n`);
      // Simulating a shell greeting
      term.write('Windows PowerShell\r\nCopyright (C) Microsoft Corporation. All rights reserved.\r\n\r\nPS C:\\workspace> ');
    });

    socket.on('terminal-output', (data) => {
      term.write(data);
    });

    term.onData((data) => {
      socket.emit('terminal-input', data);
    });

    socket.on('disconnect', () => {
      term.write('\r\n\x1b[31m=== Terminal Disconnected ===\x1b[0m\r\n');
    });
  };

  const destroyTerminal = () => {
    if (socketInstance.current) {
      socketInstance.current.disconnect();
      socketInstance.current = null;
    }
    if (xtermInstance.current) {
      if (xtermInstance.current.userData?.handleResize) {
        window.removeEventListener('resize', xtermInstance.current.userData.handleResize);
      }
      xtermInstance.current.dispose();
      xtermInstance.current = null;
    }
  };

  const handleAddTerminal = () => {
    setTerminalInstances(prev => [...prev, 'pwsh']);
    setSelectedInstanceIndex(terminalInstances.length);
  };

  const handleRemoveTerminal = (index, e) => {
    e.stopPropagation();
    if (terminalInstances.length <= 1) return;
    const newList = terminalInstances.filter((_, idx) => idx !== index);
    setTerminalInstances(newList);
    setSelectedInstanceIndex(Math.max(0, index - 1));
  };

  return (
    <div className={`border-t border-white/[0.06] bg-[#0d1117] flex flex-col transition-all overflow-hidden ${
      isMaximized ? 'h-[90%]' : 'h-[250px]'
    }`}>
      
      {/* Top Bar Terminal controls */}
      <div className="h-8 border-b border-white/[0.06] bg-[#0d1117] flex items-center justify-between px-3 select-none shrink-0 z-10">
        <div className="flex items-center gap-1.5 h-full">
          {/* Tab lists */}
          {['problems', 'output', 'debug', 'terminal', 'ports'].map((tab) => {
            const label = tab.charAt(0).toUpperCase() + tab.slice(1);
            const isTabActive = activeTab === tab;
            
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-full px-2.5 flex items-center text-[11px] font-sans border-b-2 transition cursor-pointer relative ${
                  isTabActive
                    ? 'border-blue-500 text-blue-400 font-semibold bg-white/[0.01]'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                {label === 'Debug' ? 'Debug Console' : label}
                
                {/* Visual state badges */}
                {tab === 'problems' && (
                  <span className="ml-1 px-1 bg-white/[0.04] text-slate-500 rounded text-[9px]">0</span>
                )}
                {tab === 'ports' && (
                  <span className="ml-1 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab side action tools */}
        <div className="flex items-center gap-2 text-slate-500">
          <button 
            onClick={handleAddTerminal}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer" 
            title="New Terminal"
          >
            <Plus size={11} />
          </button>
          <button 
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer" 
            title="Split Terminal"
          >
            <Columns size={11} />
          </button>
          <button 
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer" 
            title="Toggle Panel Layout"
          >
            <Layout size={11} />
          </button>
          <button 
            onClick={() => setIsMaximized(!isMaximized)}
            className={`p-1 hover:bg-slate-800 rounded transition cursor-pointer ${
              isMaximized ? 'text-blue-400 hover:text-blue-300' : 'text-slate-400 hover:text-white'
            }`} 
            title="Maximize Panel"
          >
            <Maximize2 size={11} />
          </button>
          <button 
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer border-l border-white/[0.08] pl-1.5" 
            title="Close Panel"
          >
            <X size={11} />
          </button>
        </div>
      </div>

      {/* Pane Content */}
      <div className="flex-1 flex overflow-hidden min-h-0 bg-[#090d16]">
        
        {/* PROBLEMS TAB */}
        {activeTab === 'problems' && (
          <div className="flex-1 p-4 flex flex-col items-center justify-center text-slate-500 text-[11px] font-sans select-none gap-1.5">
            <ShieldCheck size={16} className="text-emerald-500/80" />
            <span>No problems have been detected in the workspace.</span>
          </div>
        )}

        {/* OUTPUT TAB */}
        {activeTab === 'output' && (
          <div className="flex-1 p-3 overflow-y-auto scrollbar-ide font-mono text-[10px] text-slate-400 space-y-1 select-text">
            <div className="text-blue-400">[info] Antigravity Orchestration Host initialized successfully</div>
            <div className="text-slate-500">[logs] Loaded plugins: DevTools, Firebase Guidance, Visual Editor</div>
            <div className="text-slate-500">[logs] Watching workspace directory c:/workspace for hot-reloads</div>
            <div className="text-emerald-400">[success] Live connection established with Docker container API</div>
          </div>
        )}

        {/* DEBUG CONSOLE TAB */}
        {activeTab === 'debug' && (
          <div className="flex-1 p-3 flex flex-col font-mono text-[11px] text-slate-400">
            <div className="flex-1 overflow-y-auto scrollbar-ide space-y-0.5 select-text">
              <span className="text-slate-600">Debug session idle. Start debugging or execute commands inside standard terminal.</span>
            </div>
            <div className="flex items-center gap-1.5 border-t border-white/[0.02] pt-2 mt-2">
              <ChevronRight size={12} className="text-blue-500 shrink-0" />
              <input 
                type="text" 
                placeholder="Filter or run debug expression..." 
                className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder-slate-600"
              />
            </div>
          </div>
        )}

        {/* PORTS MAP TAB */}
        {activeTab === 'ports' && (
          <div className="flex-1 p-4 overflow-y-auto scrollbar-ide select-none">
            <table className="w-full text-left text-[11px] font-sans border-collapse">
              <thead>
                <tr className="text-slate-500 border-b border-white/[0.04] pb-2">
                  <th className="font-semibold pb-1.5">Port</th>
                  <th className="font-semibold pb-1.5">Process / Dev Host</th>
                  <th className="font-semibold pb-1.5">Local Address</th>
                  <th className="font-semibold pb-1.5">Status</th>
                </tr>
              </thead>
              <tbody className="text-slate-300 divide-y divide-white/[0.01]">
                <tr className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-2 text-blue-400 font-mono">3000</td>
                  <td className="py-2 font-mono">vite (node)</td>
                  <td className="py-2 text-slate-400 font-mono">http://localhost:3000</td>
                  <td className="py-2"><span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded text-[9px] font-bold border border-green-500/20">ACTIVE</span></td>
                </tr>
                <tr className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-2 text-blue-400 font-mono">8080</td>
                  <td className="py-2 font-mono">preview (gateway)</td>
                  <td className="py-2 text-slate-400 font-mono">http://localhost:8080</td>
                  <td className="py-2"><span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded text-[9px] font-bold border border-green-500/20">ACTIVE</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* TERMINAL TAB BACKED BY XTERM */}
        {activeTab === 'terminal' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Terminal canvas container */}
            <div 
              ref={terminalRef} 
              className="flex-1 p-2 bg-[#090d16] min-w-0" 
            />

            {/* Terminal Select Sidebar on the Right - matching the screenshot exactly! */}
            <div className="w-[120px] border-l border-white/[0.04] bg-[#0d1117]/30 py-1.5 flex flex-col shrink-0">
              <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold px-2.5 pb-1">SHELLS</div>
              <div className="flex-1 overflow-y-auto space-y-0.5 px-1 scrollbar-ide">
                {terminalInstances.map((shell, idx) => {
                  const isShellSelected = selectedInstanceIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedInstanceIndex(idx)}
                      className={`group flex items-center justify-between px-2 py-1 rounded text-[10px] font-mono cursor-pointer transition ${
                        isShellSelected
                          ? 'bg-blue-600/10 text-blue-400 font-semibold border border-blue-500/20'
                          : 'text-slate-400 hover:bg-white/[0.02] hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <TermIcon size={10} className={isShellSelected ? 'text-blue-400' : 'text-slate-500'} />
                        <span className="truncate">{shell}</span>
                      </div>
                      {terminalInstances.length > 1 && (
                        <button
                          onClick={(e) => handleRemoveTerminal(idx, e)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-slate-800 rounded text-slate-500 hover:text-red-400 transition"
                        >
                          <X size={9} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
