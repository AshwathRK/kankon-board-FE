// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import userDetailsReducer from "./slices/userslices";

export const store = configureStore({
  reducer: {
    userDetails: userDetailsReducer, // ✅ keep as is
  },
});
