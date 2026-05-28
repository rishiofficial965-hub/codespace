import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export default function TerminalPanel() {
  const sandboxId = useSelector((state) => state.sandbox.sandboxId);
  const activeTab = useSelector((state) => state.ui.activeTab);
  
  const terminalRef = useRef(null);
  const xtermInstance = useRef(null);
  const socketInstance = useRef(null);

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
  }, [sandboxId, activeTab]);

  const initTerminal = () => {
    destroyTerminal();

    const socketUrl = `http://${sandboxId}.agent.localhost`;
    
    const socket = io(socketUrl, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });
    socketInstance.current = socket;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 13,
      fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      theme: {
        background: '#090d16',
        foreground: '#e2e8f0',
        cursor: '#818cf8',
        selectionBackground: 'rgba(99, 102, 241, 0.3)',
      },
    });
    xtermInstance.current = term;

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);
    term.userData = { handleResize };

    socket.on('connect', () => {
      term.write('\r\n\x1b[32m=== Connected to Sandbox Terminal ===\x1b[0m\r\n');
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

  return (
    <div 
      className={`w-full h-full p-2 bg-[#090d16] ${activeTab !== 'terminal' ? 'hidden' : ''}`}
      ref={terminalRef}
    />
  );
}
