import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    flash: { showing: false, msg: "Here is a sample message", type: "SUCCESS" },
  },
  reducers: {
    flashed: (state, action) => {
      state.flash.showing = true;
      state.flash.msg = action.payload.msg;
      state.flash.type = action.payload.type;
    },
    flashHidden: (state) => {
      state.flash.showing = false;
    },
    flashedError: (state, action) => {
      state.flash.showing = true;
      state.flash.msg = action.payload;
      state.flash.type = "FAILURE";
    },
    flashedSuccess: (state, action) => {
      state.flash.showing = true;
      state.flash.msg = action.payload;
      state.flash.type = "SUCCESS";
    },
    flashedInfo: (state, action) => {
      state.flash.showing = true;
      state.flash.msg = action.payload;
      state.flash.type = "INFO";
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  flashed,
  flashHidden,
  flashedError,
  flashedSuccess,
  flashedInfo,
} = appSlice.actions;

export default appSlice.reducer;
