import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user_id: "",
  email: "",
  name: "",
  role: "",
  power: 0,
  permissions: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user_id = action.payload.user_id;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.role = action.payload.role;
      state.power = action.payload.power;
      state.permissions = { ...action.payload.permissions };
    },
    removeUser(state) {
      state.user_id = initialState.user_id;
      state.email = initialState.email;
      state.name = initialState.name;
      state.role = initialState.role;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
