import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  resumes: [],
  activeResume: null,
  loading: false,
  error: null,
};

export const resumeReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("LoadResumesRequest", (state) => {
      state.loading = true;
    })
    .addCase("LoadResumesSuccess", (state, action) => {
      state.loading = false;
      state.resumes = action.payload;
    })
    .addCase("LoadResumesFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase("LoadSingleResumeSuccess", (state, action) => {
      state.activeResume = action.payload;
    })
    .addCase("CreateResumeSuccess", (state, action) => {
      state.resumes = [action.payload, ...state.resumes];
    })
    .addCase("UpdateResumeSuccess", (state, action) => {
      state.activeResume = action.payload;
      state.resumes = state.resumes.map((r) =>
        r._id === action.payload._id ? action.payload : r
      );
    })
    .addCase("DeleteResumeSuccess", (state, action) => {
      state.resumes = state.resumes.filter((r) => r._id !== action.payload);
    })
    .addCase("clearActiveResume", (state) => {
      state.activeResume = null;
    });
});