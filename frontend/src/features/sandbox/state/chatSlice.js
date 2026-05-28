import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  isResponding: false,
  currentToolLogs: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    setIsResponding(state, action) {
      state.isResponding = action.payload;
    },
    addToolLog(state, action) {
      state.currentToolLogs.push(action.payload);
    },
    clearToolLogs(state) {
      state.currentToolLogs = [];
    },
    setToolLogs(state, action) {
      state.currentToolLogs = action.payload;
    },
    resetChat(state) {
      state.messages = [];
      state.isResponding = false;
      state.currentToolLogs = [];
    }
  }
});

export const {
  addMessage,
  setIsResponding,
  addToolLog,
  clearToolLogs,
  setToolLogs,
  resetChat
} = chatSlice.actions;

export default chatSlice.reducer;
