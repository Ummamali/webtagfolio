import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./ApplicationSlice.js";

export const makeStore = () => {
  return configureStore({
    reducer: { app: appReducer },
  });
};
