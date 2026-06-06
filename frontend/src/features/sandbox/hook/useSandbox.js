import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  setSandboxId,
  setStatus,
  setCreationStatus,
  setFiles,
  setSelectedFile,
  setFileContent,
  setFileLoading,
  setFileSaving,
  incrementPreviewKey,
  destroySandbox
} from '../state/sandboxSlice';
import {
  addMessage,
  setIsResponding,
  addToolLog,
  clearToolLogs,
  resetChat
} from '../state/chatSlice';
import { setIsCreatingFile, resetUi } from '../state/uiSlice';
import {
  startSandboxApi,
  listFilesApi,
  readFileApi,
  createFileOrFolderApi,
  deletePathApi,
  updateFilesApi,
  invokeAgentApi
} from '../services/sandbox.api';

export const useSandbox = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State selectors
  const status = useSelector((state) => state.sandbox.status);
  const creationStatus = useSelector((state) => state.sandbox.creationStatus);
  const sandboxId = useSelector((state) => state.sandbox.sandboxId);
  const files = useSelector((state) => state.sandbox.files);
  const selectedFile = useSelector((state) => state.sandbox.selectedFile);
  const fileContent = useSelector((state) => state.sandbox.fileContent);
  const fileLoading = useSelector((state) => state.sandbox.fileLoading);
  const fileSaving = useSelector((state) => state.sandbox.fileSaving);
  const previewKey = useSelector((state) => state.sandbox.previewKey);

  const messages = useSelector((state) => state.chat.messages);
  const isResponding = useSelector((state) => state.chat.isResponding);
  const currentToolLogs = useSelector((state) => state.chat.currentToolLogs);

  const isCreatingFile = useSelector((state) => state.ui.isCreatingFile);

  const { sandboxId: urlSandboxId } = useParams();

  // Sync sandboxId from URL params to Redux store
  useEffect(() => {
    if (urlSandboxId && urlSandboxId !== sandboxId) {
      dispatch(setSandboxId(urlSandboxId));
    }
  }, [urlSandboxId, sandboxId, dispatch]);

  // Hook-local states
  const [thinkingTime, setThinkingTime] = useState(0);
  const timerRef = useRef(null);

  // Sync thinking timer with isResponding state
  useEffect(() => {
    if (isResponding) {
      setThinkingTime(0);
      timerRef.current = setInterval(() => {
        setThinkingTime((prev) => prev + 1);
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

  // Hook action handlers
  const startSandbox = async () => {
    dispatch(setStatus('creating'));
    dispatch(setCreationStatus('Provisioning new workspace container...'));
    try {
      const data = await startSandboxApi();
      const id = data.sandboxId;

      dispatch(setCreationStatus('Configuring network and dependencies...'));

      // Wait a bit for Kubernetes service and agent to become active
      await new Promise((r) => setTimeout(r, 3000));

      dispatch(setSandboxId(id));
      dispatch(setStatus('ready'));
      navigate(`/sandbox/${id}`);
      return { success: true, sandboxId: id };
    } catch (err) {
      console.error(err);
      dispatch(setCreationStatus('Failed to start sandbox. Please try again.'));
      dispatch(setStatus('error'));
      return { success: false, error: err.message };
    }
  };

  const fetchFiles = async () => {
    if (!sandboxId) return { success: false, error: 'No sandbox active' };
    try {
      const data = await listFilesApi(sandboxId);
      if (data && data.success) {
        const fileList = data.files || [];
        dispatch(setFiles(fileList));
        return { success: true, files: fileList };
      }
      return { success: false, error: 'API returned success=false' };
    } catch (err) {
      console.error('Failed to list files:', err);
      return { success: false, error: err.message };
    }
  };

  const selectFile = async (filePath) => {
    if (!sandboxId) return;
    dispatch(setSelectedFile(filePath));
    dispatch(setFileLoading(true));
    dispatch(setFileContent('Loading...'));
    try {
      const data = await readFileApi(sandboxId, filePath);
      if (data && data.success && data.files && data.files[0]) {
        const keyVal = `/${filePath}`;
        const content = data.files[0][keyVal] || data.files[0][filePath] || '';
        dispatch(setFileContent(content));
      } else {
        dispatch(setFileContent('Failed to load file contents.'));
      }
    } catch (err) {
      console.error('Failed to read file:', err);
      dispatch(setFileContent('Failed to load file.'));
    } finally {
      dispatch(setFileLoading(false));
    }
  };

  const createFileOrFolder = async (createType, newFileName) => {
    if (!sandboxId || !newFileName.trim()) return;
    try {
      let file, content;
      if (createType === 'file') {
        file = newFileName;
        content = '// ' + newFileName;
      } else {
        file = `${newFileName}/.gitkeep`;
        content = '';
      }

      await createFileOrFolderApi(sandboxId, file, content);
      dispatch(setIsCreatingFile(false));
      await fetchFiles();
      if (createType === 'file') {
        await selectFile(newFileName);
      }
      return { success: true };
    } catch (err) {
      console.error(err);
      alert('Failed to create file/folder');
      return { success: false, error: err.message };
    }
  };

  const deleteFileOrFolder = async (filePath) => {
    if (!sandboxId) return;
    if (!confirm(`Are you sure you want to delete ${filePath}?`)) return;
    try {
      await deletePathApi(sandboxId, filePath);
      if (selectedFile === filePath) {
        dispatch(setSelectedFile(null));
        dispatch(setFileContent(''));
      }
      await fetchFiles();
      dispatch(incrementPreviewKey());
      return { success: true };
    } catch (err) {
      console.error(err);
      alert('Failed to delete file');
      return { success: false, error: err.message };
    }
  };

  const saveFile = async (filePath, contentVal) => {
    if (!sandboxId || !filePath) return;
    dispatch(setFileSaving(true));
    try {
      await updateFilesApi(sandboxId, [{ file: filePath, content: contentVal }]);
      dispatch(incrementPreviewKey());
      return { success: true };
    } catch (err) {
      console.error('Failed to save file:', err);
      alert('Failed to save file changes.');
      return { success: false, error: err.message };
    } finally {
      dispatch(setFileSaving(false));
    }
  };

  const sendPrompt = async (promptText) => {
    if (!promptText.trim() || isResponding || !sandboxId) return;

    const userPrompt = promptText;
    dispatch(addMessage({ id: Date.now().toString(), role: 'user', content: userPrompt }));
    dispatch(setIsResponding(true));
    dispatch(clearToolLogs());
    let assistantMessage = '';

    try {
      const response = await invokeAgentApi(sandboxId, userPrompt);
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
      await fetchFiles();

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

  const clearChat = () => {
    if (confirm('Clear chat history?')) {
      dispatch(resetChat());
    }
  };

  const handleDestroySandbox = () => {
    dispatch(destroySandbox());
    dispatch(resetChat());
    dispatch(resetUi());
  };

  const handleIncrementPreviewKey = () => {
    dispatch(incrementPreviewKey());
  };

  const toggleIsCreatingFile = (val) => {
    dispatch(setIsCreatingFile(val));
  };

  const handleSetFileContent = (content) => {
    dispatch(setFileContent(content));
  };

  const handleSetSelectedFile = (file) => {
    dispatch(setSelectedFile(file));
  };

  return {
    // Selectors
    status,
    creationStatus,
    sandboxId,
    files,
    selectedFile,
    fileContent,
    fileLoading,
    fileSaving,
    previewKey,
    messages,
    isResponding,
    currentToolLogs,
    isCreatingFile,
    thinkingTime,

    // Methods
    startSandbox,
    fetchFiles,
    selectFile,
    createFileOrFolder,
    deleteFileOrFolder,
    saveFile,
    sendPrompt,
    clearChat,
    handleDestroySandbox,
    handleIncrementPreviewKey,
    toggleIsCreatingFile,
    handleSetFileContent,
    handleSetSelectedFile
  };
};
