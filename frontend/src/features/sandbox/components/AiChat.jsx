import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, Code, Loader2, MessageSquare, Layers } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import { addMessage, setIsResponding, addToolLog, clearToolLogs } from '../state/chatSlice';
import { setFiles, incrementPreviewKey } from '../state/sandboxSlice';

export default function AiChat() {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const isResponding = useSelector((state) => state.chat.isResponding);
  const currentToolLogs = useSelector((state) => state.chat.currentToolLogs);
  const sandboxId = useSelector((state) => state.sandbox.sandboxId);

  const [promptText, setPromptText] = useState('');
  const chatEndRef = useRef(null);
  const logsEndRef = useRef(null);

  // Scroll chat & logs
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isResponding]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentToolLogs]);

  const handleSendPrompt = async (e) => {
    e.preventDefault();
    if (!promptText.trim() || isResponding) return;

    const userPrompt = promptText;
    setPromptText('');

    // Dispatch user message
    dispatch(addMessage({ id: Date.now().toString(), role: 'user', content: userPrompt }));
    dispatch(setIsResponding(true));
    dispatch(clearToolLogs());
    let assistantMessage = '';

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/agent/invoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userPrompt, projectId: sandboxId }),
      });

      if (!response.body) {
        throw new Error('Readable stream not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep last incomplete line

        for (const line of lines) {
          const cleaned = line.trim();
          if (cleaned.startsWith('data: ')) {
            const jsonStr = cleaned.slice(6);
            try {
              const chunk = JSON.parse(jsonStr);
              
              if (chunk.type === 'writer') {
                dispatch(addToolLog(chunk.content));
              } else {
                const messageObj = chunk.agent?.messages?.[0] || chunk.messages?.[0];
                if (messageObj && messageObj.content) {
                  assistantMessage = messageObj.content;
                }
              }
            } catch (err) {
              // Ignore partial chunk errors
            }
          }
        }
      }

      // Add final AI response
      dispatch(addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantMessage || 'Completed editing requested changes.',
        logs: currentToolLogs
      }));

      // Refresh file system
      try {
        const res = await axios.get(`http://${sandboxId}.agent.localhost/list-files`);
        if (res.data && res.data.success) {
          dispatch(setFiles(res.data.files || []));
        }
      } catch (err) {
        console.error('Failed to list files:', err);
      }
      
      // Reload iframe preview
      dispatch(incrementPreviewKey());

    } catch (err) {
      console.error(err);
      dispatch(addMessage({
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: 'Error: Failed to stream response from AI agent. Check network connections.'
      }));
    } finally {
      dispatch(setIsResponding(false));
    }
  };

  return (
    <section className="w-[38%] border-r border-slate-900 flex flex-col bg-slate-900/35 relative">
      <div className="h-10 border-b border-slate-800/60 px-4 flex items-center gap-2 bg-slate-900/50 select-none">
        <MessageSquare size={14} className="text-indigo-400" />
        <h2 className="text-xs font-semibold text-slate-300 font-mono tracking-wider">AI ORCHESTRATOR</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.length === 0 && (
          <div className="text-center py-12 px-6 select-none">
            <Code className="w-10 h-10 text-indigo-500/40 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-400 font-mono">Agent Ready</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto font-sans">
              Ask the assistant to write components, build routes, styled with Tailwind, and see the changes build live.
            </p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[90%] ${
              msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <div
              className={`px-3.5 py-2.5 rounded-xl text-xs leading-relaxed font-mono ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/10'
                  : msg.role === 'system'
                  ? 'bg-rose-950/40 border border-rose-900/40 text-rose-300'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
            {msg.logs && msg.logs.length > 0 && (
              <details className="mt-1.5 w-full bg-slate-950/60 border border-slate-800/40 rounded-lg p-2 text-[10px] font-mono text-slate-400">
                <summary className="cursor-pointer text-indigo-400 font-medium select-none hover:text-indigo-300">
                  View Execution Logs ({msg.logs.length})
                </summary>
                <div className="mt-1.5 space-y-1 max-h-32 overflow-y-auto divide-y divide-slate-900/30">
                  {msg.logs.map((log, idx) => (
                    <div key={idx} className="py-1 text-slate-400 whitespace-pre-wrap">{log}</div>
                  ))}
                </div>
              </details>
            )}
          </div>
        ))}

        {isResponding && (
          <div className="flex flex-col items-start space-y-3 max-w-[90%]">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl rounded-bl-none text-xs font-mono">
              <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              Generating changes...
            </div>

            {/* Live tool stream */}
            {currentToolLogs.length > 0 && (
              <div className="w-full bg-slate-950 border border-slate-900 rounded-lg p-2.5 text-[11px] font-mono text-slate-400 shadow-inner">
                <div className="flex items-center gap-1.5 text-indigo-400 mb-1 border-b border-slate-900 pb-1 select-none">
                  <Layers size={11} className="animate-pulse" />
                  <span>Active Workspace Tasks</span>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1 pr-1 font-mono">
                  {currentToolLogs.map((log, idx) => (
                    <div key={idx} className="text-slate-300 leading-normal border-l border-slate-800 pl-1.5">{log}</div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form 
        onSubmit={handleSendPrompt}
        className="p-3 border-t border-slate-900 bg-slate-900/40 flex items-end gap-2"
      >
        <textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendPrompt(e);
            }
          }}
          placeholder="Ask AI agent to build a component..."
          disabled={isResponding}
          rows={2}
          className="flex-1 bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none font-mono"
        />
        <button
          type="submit"
          disabled={isResponding || !promptText.trim()}
          className="h-10 w-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition cursor-pointer shadow-md shadow-indigo-600/10"
        >
          <Send size={14} />
        </button>
      </form>
    </section>
  );
}
