import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  loading: true,
  user: null,
  error: null,
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("LoadUserRequest", (state) => {
      state.loading = true;
    })
    .addCase("LoadUserSuccess", (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    })
    .addCase("LoadUserFail", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    })
    .addCase("LogoutSuccess", (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
    })
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});