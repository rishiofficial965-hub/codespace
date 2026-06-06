import { configureStore } from '@reduxjs/toolkit';
import { sandboxReducer, chatReducer, uiReducer } from '../features/sandbox';
import authReducer from '../features/auth/state/auth.slice.js'
export const store = configureStore({
  reducer: {
    sandbox: sandboxReducer,
    chat: chatReducer,
    ui: uiReducer,
    auth: authReducer
  },
});
