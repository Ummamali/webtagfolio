import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./ApplicationSlice.js";
import userReducer from "./UserSlice.js";

export const makeStore = () => {
  return configureStore({
    reducer: { app: appReducer, user: userReducer },
  });
};
