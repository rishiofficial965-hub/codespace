import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sandboxId: localStorage.getItem('sandbox_id') || null,
  status: 'idle', // 'idle' | 'creating' | 'ready' | 'error'
  creationStatus: '',
  files: [],
  selectedFile: null,
  fileContent: '',
  fileLoading: false,
  fileSaving: false,
  previewKey: 0,
};

const sandboxSlice = createSlice({
  name: 'sandbox',
  initialState,
  reducers: {
    setSandboxId(state, action) {
      state.sandboxId = action.payload;
      if (action.payload) {
        localStorage.setItem('sandbox_id', action.payload);
      } else {
        localStorage.removeItem('sandbox_id');
      }
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setCreationStatus(state, action) {
      state.creationStatus = action.payload;
    },
    setFiles(state, action) {
      state.files = action.payload;
    },
    setSelectedFile(state, action) {
      state.selectedFile = action.payload;
    },
    setFileContent(state, action) {
      state.fileContent = action.payload;
    },
    setFileLoading(state, action) {
      state.fileLoading = action.payload;
    },
    setFileSaving(state, action) {
      state.fileSaving = action.payload;
    },
    incrementPreviewKey(state) {
      state.previewKey += 1;
    },
    destroySandbox(state) {
      state.sandboxId = null;
      state.status = 'idle';
      state.creationStatus = '';
      state.files = [];
      state.selectedFile = null;
      state.fileContent = '';
      localStorage.removeItem('sandbox_id');
    }
  }
});

export const {
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
} = sandboxSlice.actions;

export default sandboxSlice.reducer;
