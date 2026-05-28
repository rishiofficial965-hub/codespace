import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, Trash2, Save, Code } from 'lucide-react';
import axios from 'axios';
import { 
  setFiles, 
  setSelectedFile, 
  setFileContent, 
  setFileLoading, 
  setFileSaving,
  incrementPreviewKey 
} from '../state/sandboxSlice';
import { setIsCreatingFile } from '../state/uiSlice';

export default function FileExplorer() {
  const dispatch = useDispatch();
  const sandboxId = useSelector((state) => state.sandbox.sandboxId);
  const files = useSelector((state) => state.sandbox.files);
  const selectedFile = useSelector((state) => state.sandbox.selectedFile);
  const fileContent = useSelector((state) => state.sandbox.fileContent);
  const fileLoading = useSelector((state) => state.sandbox.fileLoading);
  const fileSaving = useSelector((state) => state.sandbox.fileSaving);
  const isCreatingFile = useSelector((state) => state.ui.isCreatingFile);
  const activeTab = useSelector((state) => state.ui.activeTab);

  const [newFileName, setNewFileName] = useState('');

  useEffect(() => {
    if (sandboxId && activeTab === 'explorer') {
      fetchFiles();
    }
  }, [sandboxId, activeTab]);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`http://${sandboxId}.agent.localhost/list-files`);
      if (res.data && res.data.success) {
        dispatch(setFiles(res.data.files || []));
      }
    } catch (err) {
      console.error('Failed to list files:', err);
    }
  };

  const handleSelectFile = async (filePath) => {
    dispatch(setSelectedFile(filePath));
    dispatch(setFileLoading(true));
    dispatch(setFileContent('Loading...'));
    try {
      const res = await axios.get(`http://${sandboxId}.agent.localhost/read-files`, {
        params: { files: filePath }
      });
      if (res.data && res.data.success && res.data.files && res.data.files[0]) {
        const content = res.data.files[0][`/${filePath}`] || res.data.files[0][filePath] || '';
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

  const handleSaveFile = async () => {
    if (!selectedFile) return;
    dispatch(setFileSaving(true));
    try {
      await axios.patch(`http://${sandboxId}.agent.localhost/update-files`, {
        updates: [{ file: selectedFile, content: fileContent }]
      });
      dispatch(setFileSaving(false));
      dispatch(incrementPreviewKey());
    } catch (err) {
      console.error('Failed to save file:', err);
      alert('Failed to save file changes.');
      dispatch(setFileSaving(false));
    }
  };

  const handleCreateFileSubmit = async (e) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    try {
      await axios.post(`http://${sandboxId}.agent.localhost/create-files`, {
        files: [{ file: newFileName, content: '// ' + newFileName }]
      });
      const createdPath = newFileName;
      setNewFileName('');
      dispatch(setIsCreatingFile(false));
      await fetchFiles();
      handleSelectFile(createdPath);
    } catch (err) {
      console.error(err);
      alert('Failed to create file');
    }
  };

  const handleDeleteFile = async (filePath) => {
    if (!confirm(`Are you sure you want to delete ${filePath}?`)) return;
    try {
      await axios.delete(`http://${sandboxId}.agent.localhost/delete-path`, {
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

  if (activeTab !== 'explorer') return null;

  return (
    <div className="w-full h-full flex overflow-hidden font-mono text-xs">
      {/* Sidebar file list */}
      <div className="w-1/4 border-r border-slate-900 p-2 overflow-y-auto flex flex-col gap-1 select-none scrollbar-thin scrollbar-thumb-slate-900">
        {isCreatingFile && (
          <form onSubmit={handleCreateFileSubmit} className="mb-2 p-1.5 bg-slate-900 border border-slate-800 rounded">
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="src/MyComp.jsx"
              className="w-full bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-200 outline-none"
              autoFocus
            />
            <div className="flex justify-end gap-1.5 mt-1.5 text-[9px]">
              <button 
                type="button" 
                onClick={() => dispatch(setIsCreatingFile(false))} 
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="text-indigo-400 font-semibold hover:text-indigo-300 cursor-pointer"
              >
                Create
              </button>
            </div>
          </form>
        )}

        {files.length === 0 ? (
          <div className="text-slate-600 text-center py-8 text-[11px] select-none">No files listed</div>
        ) : (
          files.map((file) => (
            <div 
              key={file}
              className={`group flex items-center justify-between px-2 py-1 rounded cursor-pointer transition ${
                selectedFile === file ? 'bg-slate-900 text-indigo-400' : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-300'
              }`}
            >
              <div 
                className="flex items-center gap-1.5 flex-1 min-w-0"
                onClick={() => handleSelectFile(file)}
              >
                <FileText size={11} className={selectedFile === file ? 'text-indigo-400' : 'text-slate-500'} />
                <span className="truncate">{file}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(file);
                }}
                className="opacity-0 group-hover:opacity-100 hover:bg-slate-800 text-slate-500 hover:text-rose-400 p-0.5 rounded transition cursor-pointer"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Editor pane */}
      <div className="flex-1 flex flex-col bg-slate-950 relative">
        {selectedFile ? (
          <div className="flex-1 flex flex-col">
            <div className="h-8 border-b border-slate-900 bg-slate-900/30 flex items-center justify-between px-3">
              <span className="text-[10px] text-slate-400 font-bold select-none">{selectedFile}</span>
              <button
                onClick={handleSaveFile}
                disabled={fileSaving || fileLoading}
                className="flex items-center gap-1 px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-[10px] text-white rounded transition cursor-pointer"
              >
                <Save size={10} />
                {fileSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
            <textarea
              value={fileContent}
              onChange={(e) => dispatch(setFileContent(e.target.value))}
              disabled={fileLoading}
              className="flex-1 w-full p-4 bg-slate-950 text-slate-300 font-mono text-xs border-none outline-none resize-none scrollbar-thin scrollbar-thumb-slate-900"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 select-none">
            <Code size={18} className="text-slate-800 mb-1.5" />
            <span>Select a file from the explorer to view or edit</span>
          </div>
        )}
      </div>
    </div>
  );
}
