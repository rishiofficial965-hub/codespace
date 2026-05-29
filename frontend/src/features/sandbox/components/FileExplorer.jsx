import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  Trash2, 
  Plus, 
  RefreshCw,
  Braces,
  FileCode2,
  FileText,
  FileJson,
  FileHeart,
  FolderPlus,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import { 
  setFiles, 
  setSelectedFile, 
  setFileContent, 
  setFileLoading,
  incrementPreviewKey 
} from '../state/sandboxSlice';
import { setIsCreatingFile } from '../state/uiSlice';
import { agentUrl } from '../../../config';

// Helper function to build nested hierarchy from flat list of files
function buildFileTree(filesArray) {
  const root = { name: 'root', type: 'directory', path: '', children: [] };
  
  filesArray.forEach((filePath) => {
    // Normalize path separators to forward slash to prevent OS discrepancies
    const normalized = filePath.replace(/\\/g, '/');
    const parts = normalized.split('/');
    let current = root;
    let currentPath = '';
    
    parts.forEach((part, index) => {
      if (!part) return;
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isLast = index === parts.length - 1;
      
      let existing = current.children.find(child => child.name === part);
      if (!existing) {
        existing = {
          name: part,
          type: isLast ? 'file' : 'directory',
          path: currentPath,
        };
        if (!isLast) {
          existing.children = [];
        }
        current.children.push(existing);
      }
      current = existing;
    });
  });
  
  // Sort: directories first, then files, both alphabetically
  const sortTree = (node) => {
    if (node.children) {
      node.children.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      node.children.forEach(sortTree);
    }
  };
  
  sortTree(root);
  return root.children;
}

export default function FileExplorer() {
  const dispatch = useDispatch();
  const sandboxId = useSelector((state) => state.sandbox.sandboxId);
  const files = useSelector((state) => state.sandbox.files);
  const selectedFile = useSelector((state) => state.sandbox.selectedFile);
  const isCreatingFile = useSelector((state) => state.ui.isCreatingFile);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState({});
  const [newFileName, setNewFileName] = useState('');
  const [createType, setCreateType] = useState('file'); // 'file' | 'folder'
  
  const [showOutline, setShowOutline] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  // Guard against concurrent / duplicate fetches
  const isFetching = useRef(false);
  const lastFetchedId = useRef(null);

  useEffect(() => {
    if (sandboxId && sandboxId !== lastFetchedId.current) {
      fetchFiles();
    }
  }, [sandboxId]);

  const fetchFiles = async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    setLoading(true);
    setError(false);
    try {
      const res = await axios.get(agentUrl(sandboxId, '/list-files'));
      console.log("Explorer API Response", res.data);

      if (res.data && res.data.success) {
        const fileList = res.data.files || [];
        dispatch(setFiles(fileList));
        
        // Auto-expand top level directories by default
        const initialExpanded = {};
        fileList.forEach(file => {
          const topDir = file.replace(/\\/g, '/').split('/')[0];
          if (file.includes('/') || file.includes('\\')) {
            initialExpanded[topDir] = true;
          }
        });
        setExpandedPaths(prev => ({ ...initialExpanded, ...prev }));
        lastFetchedId.current = sandboxId;
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Failed to list files:', err);
      setError(true);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  const handleSelectFile = async (filePath) => {
    dispatch(setSelectedFile(filePath));
    dispatch(setFileLoading(true));
    dispatch(setFileContent('Loading...'));
    try {
      const res = await axios.get(agentUrl(sandboxId, '/read-files'), {
        params: { files: filePath }
      });
      if (res.data && res.data.success && res.data.files && res.data.files[0]) {
        // Standardize key retrieval
        const keyVal = `/${filePath}`;
        const content = res.data.files[0][keyVal] || res.data.files[0][filePath] || '';
        dispatch(setFileContent(content));
        dispatch(setFileLoading(false));
      } else {
        dispatch(setFileContent('Failed to load file contents.'));
        dispatch(setFileLoading(false));
      }
    } catch (err) {
      console.error('Failed to read file:', err);
      dispatch(setFileContent('Failed to load file.'));
      dispatch(setFileLoading(false));
    }
  };

  const handleToggleExpand = (path) => {
    setExpandedPaths(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    try {
      if (createType === 'file') {
        await axios.post(agentUrl(sandboxId, '/create-files'), {
          files: [{ file: newFileName, content: '// ' + newFileName }]
        });
      } else {
        // Folders created in agent via folder placeholder or dummy file
        await axios.post(agentUrl(sandboxId, '/create-files'), {
          files: [{ file: `${newFileName}/.gitkeep`, content: '' }]
        });
      }
      setNewFileName('');
      dispatch(setIsCreatingFile(false));
      await fetchFiles();
      if (createType === 'file') {
        handleSelectFile(newFileName);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to create file/folder');
    }
  };

  const handleDeleteFile = async (filePath) => {
    if (!confirm(`Are you sure you want to delete ${filePath}?`)) return;
    try {
      await axios.delete(agentUrl(sandboxId, '/delete-path'), {
        data: { path: filePath }
      });
      if (selectedFile === filePath) {
        dispatch(setSelectedFile(null));
        dispatch(setFileContent(''));
      }
      await fetchFiles();
      dispatch(incrementPreviewKey());
    } catch (err) {
      console.error(err);
      alert('Failed to delete file');
    }
  };

  const treeData = buildFileTree(files);

  // Render a recursive node in tree
  const renderNode = (node, depth = 0) => {

    const isExpanded = expandedPaths[node.path];
    const isSelected = selectedFile === node.path;
    const paddingLeft = `${depth * 12 + 8}px`;

    const getIcon = () => {
      if (node.type === 'directory') {
        return (
          <span className="text-amber-400 mr-1.5 shrink-0">
            {isExpanded ? (
              <FolderOpen size={14} className="fill-amber-400/10" />
            ) : (
              <Folder size={14} className="fill-amber-400/10" />
            )}
          </span>
        );
      }

      // Check extensions for icons
      const ext = node.name.split('.').pop()?.toLowerCase();
      switch (ext) {
        case 'json':
          return <Braces size={14} className="text-yellow-500 shrink-0 mr-1.5" />;
        case 'js':
        case 'jsx':
          return <FileCode2 size={14} className="text-yellow-400 shrink-0 mr-1.5" />;
        case 'ts':
        case 'tsx':
          return <FileCode2 size={14} className="text-blue-400 shrink-0 mr-1.5" />;
        case 'css':
          return <FileText size={14} className="text-teal-400 shrink-0 mr-1.5" />;
        case 'md':
          return <FileHeart size={14} className="text-emerald-400 shrink-0 mr-1.5" />;
        default:
          return <FileText size={14} className="text-slate-400 shrink-0 mr-1.5" />;
      }
    };

    const handleNodeClick = () => {
      if (node.type === 'directory') {
        handleToggleExpand(node.path);
      } else {
        handleSelectFile(node.path);
      }
    };

    return (
      <div key={node.path} className="flex flex-col">
        <div
          onClick={handleNodeClick}
          style={{ paddingLeft }}
          className={`group flex items-center justify-between py-1 pr-2 hover:bg-white/[0.04] transition-colors cursor-pointer select-none ${
            isSelected 
              ? 'bg-blue-500/10 border-l-2 border-blue-500 text-blue-400 font-medium' 
              : 'text-slate-300 border-l-2 border-transparent'
          }`}
        >
          <div className="flex items-center min-w-0 flex-1">
            {node.type === 'directory' ? (
              <ChevronRight
                size={12}
                className={`mr-1 text-slate-500 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              />
            ) : (
              <span className="w-4 shrink-0" />
            )}
            {getIcon()}
            <span className="truncate text-[11px] font-sans tracking-wide leading-none py-0.5">{node.name}</span>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteFile(node.path);
            }}
            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-slate-800 rounded text-slate-500 hover:text-red-400 transition cursor-pointer"
            title="Delete Item"
          >
            <Trash2 size={10} />
          </button>
        </div>

        {node.type === 'directory' && isExpanded && node.children && (
          <div className="flex flex-col">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0f14] border-r border-white/[0.06] overflow-hidden select-none">
      {/* Explorer Title Header */}
      <div className="h-8 border-b border-white/[0.06] px-3 flex items-center justify-between shrink-0 bg-[#0a0f14]">
        <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400 font-sans">EXPLORER</span>
        <div className="flex items-center gap-1.5 text-slate-500">
          <button 
            onClick={() => {
              setCreateType('file');
              dispatch(setIsCreatingFile(!isCreatingFile));
            }}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
            title="New File"
          >
            <Plus size={12} />
          </button>
          <button 
            onClick={() => {
              setCreateType('folder');
              dispatch(setIsCreatingFile(!isCreatingFile));
            }}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
            title="New Folder"
          >
            <FolderPlus size={12} />
          </button>
          <button 
            onClick={fetchFiles}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
            title="Refresh Explorer"
          >
            <RefreshCw size={11} />
          </button>
        </div>
      </div>

      {/* Active Workspace / Project Folder Title */}
      <div className="px-3 py-1.5 flex items-center gap-1.5 text-slate-400 bg-white/[0.02] border-b border-white/[0.03]">
        <ChevronRight size={11} className="rotate-90 text-slate-500 shrink-0" />
        <span className="text-[11px] font-bold text-slate-200 tracking-wide font-sans">capstone</span>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-ide bg-[#0a0f14]/80 py-1">
        {isCreatingFile && (
          <form onSubmit={handleCreateSubmit} className="mx-2 my-1.5 p-2 bg-slate-900 border border-white/[0.06] rounded-md shadow-lg">
            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">
              Create New {createType}
            </div>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder={createType === 'file' ? 'src/MyComponent.jsx' : 'src/components'}
              className="w-full bg-slate-950 border border-white/[0.06] px-2 py-1 rounded text-xs text-slate-200 outline-none placeholder-slate-600 font-sans"
              autoFocus
            />
            <div className="flex justify-end gap-1.5 mt-2 text-[10px]">
              <button 
                type="button" 
                onClick={() => dispatch(setIsCreatingFile(false))} 
                className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-2.5 py-0.5 rounded bg-blue-600 font-medium text-white hover:bg-blue-500 transition cursor-pointer"
              >
                Create
              </button>
            </div>
          </form>
        )}

        {/* LOADING STATE */}
        {loading ? (
          <div className="animate-pulse space-y-2.5 p-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-2" style={{ paddingLeft: `${(i % 3) * 12}px` }}>
                <div className="w-3.5 h-3.5 bg-slate-800/60 rounded"></div>
                <div className="h-3 bg-slate-800/60 rounded" style={{ width: `${50 + Math.random() * 50}px` }}></div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* ERROR STATE */
          <div className="p-4 text-center select-none flex flex-col items-center gap-2">
            <AlertTriangle size={18} className="text-red-400" />
            <div className="text-slate-400 text-xs font-medium">Unable to load project files</div>
            <button
              onClick={fetchFiles}
              className="mt-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-sans transition cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw size={10} />
              Retry
            </button>
          </div>
        ) : treeData.length === 0 ? (
          /* EMPTY STATE */
          <div className="text-slate-500 text-center py-10 text-[11px] select-none font-sans">
            Workspace is empty
          </div>
        ) : (
          /* DYNAMIC RENDER */
          <div className="flex flex-col">
            {treeData.map(node => renderNode(node, 0))}
          </div>
        )}
      </div>

      {/* OUTLINE ACCORDION */}
      <div className="border-t border-white/[0.06] shrink-0 bg-[#0a0f14]">
        <button 
          onClick={() => setShowOutline(!showOutline)}
          className="w-full h-7 px-2.5 flex items-center gap-1.5 hover:bg-white/[0.02] transition-colors text-left"
        >
          <ChevronRight 
            size={11} 
            className={`text-slate-500 transition-transform ${showOutline ? 'rotate-90' : ''}`} 
          />
          <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase font-sans">Outline</span>
        </button>
        {showOutline && (
          <div className="px-6 py-2 text-[10px] text-slate-500 font-sans italic bg-white/[0.01]">
            No outline information detected
          </div>
        )}
      </div>

      {/* TIMELINE ACCORDION */}
      <div className="border-t border-white/[0.06] shrink-0 bg-[#0a0f14]">
        <button 
          onClick={() => setShowTimeline(!showTimeline)}
          className="w-full h-7 px-2.5 flex items-center gap-1.5 hover:bg-white/[0.02] transition-colors text-left"
        >
          <ChevronRight 
            size={11} 
            className={`text-slate-500 transition-transform ${showTimeline ? 'rotate-90' : ''}`} 
          />
          <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase font-sans">Timeline</span>
        </button>
        {showTimeline && (
          <div className="px-6 py-2 text-[10px] text-slate-500 font-sans italic bg-white/[0.01]">
            No timeline history available
          </div>
        )}
      </div>
    </div>
  );
}
