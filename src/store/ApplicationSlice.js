import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    panelOpened: false,
  },
  reducers: {
    panelOpened: (state) => {
      state.panelOpened = true;
    },
    panelClosed: (state) => {
      state.panelOpened = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { panelClosed, panelOpened } = appSlice.actions;

export default appSlice.reducer;
