import { configureStore } from '@reduxjs/toolkit';
import { sandboxReducer, chatReducer, uiReducer } from '../features/sandbox';

export const store = configureStore({
  reducer: {
    sandbox: sandboxReducer,
    chat: chatReducer,
    ui: uiReducer,
  },
});
