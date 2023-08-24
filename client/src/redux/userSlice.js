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
    changeProfile: (state, action) => {
      state.currentUser.profilePicture = action.payload;
    },
    following: (state, action) => {
      if (state.currentUser.following.includes(action.payload)) {
        state.currentUser.following.splice(
          state.currentUser.following.findIndex(
            (followingId) => followingId === action.payload
          )
        );
      } else {
        state.currentUser.following.push(action.payload);
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, changeProfile, following } =
  userSlices.actions;

export default userSlices.reducer;
