import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sessionId: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.sessionId = action.payload.sessionId;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.sessionId = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
