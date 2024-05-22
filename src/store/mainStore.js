import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./ApplicationSlice.js";
import userReducer from "./UserSlice.js";
import orgSlice from "./OrgSlice.js";
import bucketsSlice from "./BucketsSlice.js";
import ChatReducer from "./ChatsSlice.js";

export const makeStore = () => {
  return configureStore({
    reducer: {
      app: appReducer,
      user: userReducer,
      org: orgSlice.reducer,
      buckets: bucketsSlice.reducer,
      chats: ChatReducer,
    },
  });
};
