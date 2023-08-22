import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  isLoading: false,
  error: false,
};

export const userSlices = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.error = true;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = false;
    },
    logout: (state) => {
      return initialState;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  userSlices.actions;

export default userSlices.reducer;
