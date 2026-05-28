import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: 'terminal', // 'terminal' | 'explorer'
  isCreatingFile: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    setIsCreatingFile(state, action) {
      state.isCreatingFile = action.payload;
    },
    resetUi(state) {
      state.activeTab = 'terminal';
      state.isCreatingFile = false;
    }
  }
});

export const {
  setActiveTab,
  setIsCreatingFile,
  resetUi
} = uiSlice.actions;

export default uiSlice.reducer;
