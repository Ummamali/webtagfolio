import { createSlice } from "@reduxjs/toolkit";
import {
  asyncSliceInitial,
  asyncSliceReducers,
  generateAsyncThunk,
} from "./utils/asyncSlice";
import { simpleBackend } from "../../backend";

const orgSlice = createSlice({
  name: "org",
  initialState: asyncSliceInitial,
  reducers: { ...asyncSliceReducers },
});

// Action creators are generated for each case reducer function
export const orgActions = orgSlice.actions;

async function loadFromServer({ token }) {
  const res = await fetch(simpleBackend.urls.allOrgs, {
    headers: {
      Authorization: token,
    },
  });
  if (res.ok) {
    const resObj = await res.json();
    return resObj;
  } else {
    throw new Error("bad bad thing");
  }
}

export const loadOrgsThunk = generateAsyncThunk(
  "org",
  orgActions,
  loadFromServer
);

export default orgSlice;
