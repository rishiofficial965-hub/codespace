import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Send, 
  Code, 
  Loader2, 
  MessageSquare, 
  Layers, 
  Plus, 
  X, 
  History, 
  MoreHorizontal,
  FileText,
  Terminal as TerminalIcon,
  Search,
  Brain,
  ChevronRight,
  Mic,
  Settings,
  Sparkles,
  Clipboard,
  Check
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL, agentUrl } from '../../../config';
import { addMessage, setIsResponding, addToolLog, clearToolLogs, resetChat } from '../state/chatSlice';
import { setFiles, incrementPreviewKey } from '../state/sandboxSlice';

// Helper inline markdown parser to bypass external package weight
const renderInlineMarkdown = (text) => {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="px-1.5 py-0.5 bg-slate-950 border border-white/[0.04] rounded font-mono text-[10px] text-blue-400">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

const renderMarkdown = (text) => {
  if (!text) return '';
  const parts = text.split(/(```[\s\S]*?```)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('```')) {
      const match = part.match(/```(\w*)\n([\s\S]*?)```/);
      const lang = match ? match[1] : '';
      const code = match ? match[2] : part.slice(3, -3);
      
      return (
        <div key={index} className="my-2.5 rounded-lg border border-white/[0.06] bg-[#090d16] overflow-hidden font-mono text-[11px] group relative shadow-md">
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#0a0f14] border-b border-white/[0.04] select-none">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">{lang || 'code'}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(code);
              }}
              className="px-1.5 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[9px] text-slate-400 hover:text-slate-200 transition font-sans cursor-pointer flex items-center gap-1"
            >
              Copy
            </button>
          </div>
          <pre className="p-3 overflow-x-auto scrollbar-ide"><code className="text-slate-300">{code}</code></pre>
        </div>
      );
    }
    
    // Process paragraphs and line items
    const lines = part.split('\n');
    return lines.map((line, lineIdx) => {
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        return (
          <li key={lineIdx} className="ml-4 list-disc text-slate-300 text-xs py-0.5 font-sans leading-relaxed">
            {renderInlineMarkdown(line.trim().substring(2))}
          </li>
        );
      }
      if (line.trim() === '') {
        return <div key={lineIdx} className="h-1.5" />;
      }
      return (
        <p key={lineIdx} className="text-slate-300 text-xs py-0.5 font-sans leading-relaxed">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  });
};

export default function AiChat() {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const isResponding = useSelector((state) => state.chat.isResponding);
  const currentToolLogs = useSelector((state) => state.chat.currentToolLogs);
  const sandboxId = useSelector((state) => state.sandbox.sandboxId);

  const [promptText, setPromptText] = useState('');
  const [selectedModel, setSelectedModel] = useState('Gemini 3.5 Flash (Medium)');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [thinkingTime, setThinkingTime] = useState(0);
  
  const chatEndRef = useRef(null);
  const timerRef = useRef(null);

  const modelsList = [
    'Gemini 3.5 Flash (Medium)',
    'Gemini 3.5 Flash (High)',
    'Gemini 3.5 Pro (High)'
  ];

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isResponding, currentToolLogs]);

  // Handle thinking timer
  useEffect(() => {
    if (isResponding) {
      setThinkingTime(0);
      timerRef.current = setInterval(() => {
        setThinkingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isResponding]);

  const handleSendPrompt = async (e) => {
    if (e) e.preventDefault();
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

      // Add final assistant message with copies of logs
      dispatch(addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantMessage || 'Successfully performed requested modifications.',
        logs: [...currentToolLogs],
        duration: thinkingTime
      }));

      // Refresh file explorer list
      try {
        const res = await axios.get(agentUrl(sandboxId, '/list-files'));
        if (res.data && res.data.success) {
          dispatch(setFiles(res.data.files || []));
        }
      } catch (err) {
        console.error('Failed to list files:', err);
      }
      
      // Hot Reload preview server
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear chat history?')) {
      dispatch(resetChat());
    }
  };

  return (
    <section className="w-[320px] border-l border-white/[0.06] flex flex-col bg-[#0a0f14] relative shrink-0">
      
      {/* Header matching screenshot exactly */}
      <div className="h-8 border-b border-white/[0.06] px-3 flex items-center justify-between bg-[#0a0f14] select-none shrink-0 z-10">
        <div className="flex items-center gap-1.5">
          <Sparkles size={11} className="text-blue-400" />
          <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400 font-sans">AI Agent</span>
        </div>
        
        <div className="flex items-center gap-1 text-slate-500">
          <button 
            onClick={() => dispatch(clearToolLogs())}
            className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
            title="Reset Active Logs"
          >
            <Plus size={11} />
          </button>
          <button 
            onClick={handleClearHistory}
            className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
            title="Reload History"
          >
            <History size={11} />
          </button>
          <button 
            className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
            title="Actions Menu"
          >
            <MoreHorizontal size={11} />
          </button>
          <button 
            onClick={handleClearHistory}
            className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer border-l border-white/[0.08] pl-1.5 ml-1"
            title="Close Panel"
          >
            <X size={11} />
          </button>
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-ide bg-[#0a0f14]/40">
        {messages.length === 0 && (
          <div className="text-center py-16 px-6 select-none flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
            <h3 className="text-xs font-semibold text-slate-300 font-sans tracking-wide">Autonomous Assistant</h3>
            <p className="text-[11px] text-slate-500 mt-1.5 max-w-[200px] leading-relaxed font-sans text-center">
              Describe components or logic you want built, and see the agent modify directories live.
            </p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[95%] ${
              msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            {/* Message Bubble */}
            <div
              className={`px-3 py-2.5 rounded-lg text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/10 font-sans'
                  : msg.role === 'system'
                  ? 'bg-red-950/20 border border-red-900/30 text-red-300 font-mono'
                  : 'bg-slate-900/60 border border-white/[0.04] text-slate-300 rounded-tl-none font-sans'
              }`}
            >
              {msg.role === 'user' ? msg.content : renderMarkdown(msg.content)}
            </div>

            {/* Completed tool logs */}
            {msg.logs && msg.logs.length > 0 && (
              <div className="mt-2 w-full select-none">
                <details className="group border border-white/[0.04] bg-slate-950/20 rounded-md p-1.5 transition-all">
                  <summary className="cursor-pointer text-[10px] text-slate-400 font-medium font-sans flex items-center gap-1.5 list-none">
                    <ChevronRight size={10} className="text-slate-500 group-open:rotate-90 transition-transform" />
                    <span>Worked for {msg.duration || 4}s &gt;</span>
                  </summary>
                  <div className="mt-1.5 pl-3 border-l border-white/[0.04] space-y-1 max-h-32 overflow-y-auto scrollbar-ide text-[9px] font-mono text-slate-500 divide-y divide-white/[0.01]">
                    {msg.logs.map((log, idx) => (
                      <div key={idx} className="py-0.5 text-slate-400 whitespace-pre-wrap">{log}</div>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>
        ))}

        {/* ACTIVE STREAM RESPONDING STATE */}
        {isResponding && (
          <div className="flex flex-col items-start space-y-3 max-w-[95%]">
            {/* Loading Indicator */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/40 border border-white/[0.04] text-slate-400 rounded-lg rounded-tl-none text-xs font-sans">
              <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
              <span>Generating response... ({thinkingTime}s)</span>
            </div>

            {/* Live tool log stream */}
            {currentToolLogs.length > 0 && (
              <div className="w-full bg-slate-950 border border-white/[0.04] rounded-lg p-2.5 shadow-inner">
                <div className="flex items-center gap-1.5 text-blue-400 mb-1.5 border-b border-white/[0.02] pb-1 select-none text-[10px] font-sans">
                  <Layers size={10} className="animate-pulse" />
                  <span>Agent Working...</span>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1 pr-1 font-mono text-[9px] text-slate-400 scrollbar-ide">
                  {currentToolLogs.map((log, idx) => (
                    <div key={idx} className="leading-normal border-l border-blue-500/50 pl-1.5 text-slate-300">{log}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input box section with high-end tools matching screenshot */}
      <div className="p-3.5 border-t border-white/[0.06] bg-[#0a0f14]/50 shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); handleSendPrompt(); }}>
          <div className="bg-[#111827] border border-white/[0.06] rounded-xl p-2.5 flex flex-col gap-2 shadow-inner">
            {/* Micro action tags above text */}
            <div className="flex items-center gap-2 text-slate-500">
              <button type="button" className="hover:text-slate-300 p-0.5 rounded cursor-pointer transition" title="Add File Context">
                <FileText size={11} />
              </button>
              <button type="button" className="hover:text-slate-300 p-0.5 rounded cursor-pointer transition" title="Inject Code Block">
                <Code size={11} />
              </button>
              <button type="button" className="hover:text-slate-300 p-0.5 rounded cursor-pointer transition" title="Explain Output">
                <Brain size={11} />
              </button>
              <button type="button" className="hover:text-slate-300 p-0.5 rounded cursor-pointer transition" title="Open Settings">
                <Settings size={11} />
              </button>
            </div>
            
            {/* Textarea */}
            <textarea
              id="ai-chat-input"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything, @ to mention, / for actions"
              rows={2}
              className="w-full bg-transparent text-slate-200 text-xs outline-none resize-none font-sans leading-normal placeholder-slate-500"
              disabled={isResponding}
            />
            
            {/* Dropdowns & Submit Row */}
            <div className="flex items-center justify-between border-t border-white/[0.02] pt-2 relative">
              {/* Model Select Badge */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="flex items-center gap-1 text-[9px] text-slate-400 hover:text-slate-200 bg-white/[0.02] hover:bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.04] transition cursor-pointer font-sans"
                >
                  <Plus size={8} className="text-slate-500" />
                  <span>{selectedModel}</span>
                  <ChevronRight size={8} className="rotate-90 text-slate-500 shrink-0" />
                </button>
                
                {showModelDropdown && (
                  <div className="absolute bottom-full left-0 mb-1 w-44 bg-slate-900 border border-white/[0.08] rounded-md shadow-2xl z-30 select-none py-1 overflow-hidden">
                    {modelsList.map(model => (
                      <button
                        key={model}
                        type="button"
                        onClick={() => {
                          setSelectedModel(model);
                          setShowModelDropdown(false);
                        }}
                        className={`w-full text-left px-2.5 py-1 text-[9px] font-sans hover:bg-blue-600 hover:text-white transition flex items-center justify-between ${
                          selectedModel === model ? 'text-blue-400 font-semibold' : 'text-slate-300'
                        }`}
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Voice and Send Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  className="p-1 hover:bg-white/[0.02] rounded text-slate-500 hover:text-slate-300 transition cursor-pointer"
                  title="Voice Dictation"
                >
                  <Mic size={11} />
                </button>
                <button
                  type="submit"
                  disabled={isResponding || !promptText.trim()}
                  className="h-6 w-6 flex items-center justify-center bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-md transition cursor-pointer shadow-md shadow-blue-600/10 shrink-0"
                >
                  <Send size={10} />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

    </section>
  );
}
