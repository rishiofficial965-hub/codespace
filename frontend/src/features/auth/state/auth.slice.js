import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    pendingUserId: null, 
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      // Only clear pendingUserId when a real user is set (login/verify success),
      // not when setUser(null) is called (e.g. failed getMe on page load).
      if (action.payload) {
        state.pendingUserId = null;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPendingUserId: (state, action) => {
      state.pendingUserId = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.pendingUserId = null;
      state.error = null;
    },
  },
});

export const { setError, setUser, setLoading, setPendingUserId, logout } =
  authSlice.actions;

export default authSlice.reducer;
