import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    token: null,
  },
  reducers: {
    userIdentified: (state, action) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
    },
  },
});

// Action creators are generated for each case reducer function
export const { userIdentified } = userSlice.actions;

export default userSlice.reducer;