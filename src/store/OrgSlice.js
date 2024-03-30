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
  reducers: {
    ...asyncSliceReducers,
    orgCreated: (state, action) => {
      state.data["ownedOrganizations"].push(action.payload);
    },
    orgDeleted: (state, action) => {
      const idx = state.data.ownedOrganizations.findIndex(
        (obj) => obj["_id"] === action.payload
      );
      state.data.ownedOrganizations.splice(idx, 1);
    },
    codeGenerated: (state, action) => {
      const idx = state.data.ownedOrganizations.findIndex(
        (obj) => obj["name"] === action.payload.name
      );
      state.data.ownedOrganizations[idx]["joinCode"] = action.payload.joinCode;
    },
  },
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
