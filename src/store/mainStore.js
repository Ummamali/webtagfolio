import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./ApplicationSlice.js";
import userReducer from "./UserSlice.js";
import orgSlice from "./OrgSlice.js";
import bucketsSlice from "./BucketsSlice.js";

export const makeStore = () => {
  return configureStore({
    reducer: {
      app: appReducer,
      user: userReducer,
      org: orgSlice.reducer,
      buckets: bucketsSlice.reducer,
    },
  });
};
