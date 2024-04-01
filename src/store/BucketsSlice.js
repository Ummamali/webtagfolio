import { createSlice } from "@reduxjs/toolkit";
import {
  asyncSliceInitial,
  asyncSliceReducers,
  generateAsyncThunk,
} from "./utils/asyncSlice";
import { simpleBackend } from "../../backend";

const bucketsSlice = createSlice({
  name: "buckets",
  initialState: asyncSliceInitial,
  reducers: {
    ...asyncSliceReducers,
    bucketCreated: (state, action) => {
      state.data.list.push(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const bucketsActions = bucketsSlice.actions;

async function loadFromServer({ token }) {
  const res = await fetch(simpleBackend.urls.allBuckets, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  });
  if (res.ok) {
    const bucketsList = await res.json();
    return { list: bucketsList };
  } else {
    throw new Error("Bad Bad thing");
  }
}

export const loadBucketsThunk = generateAsyncThunk(
  "buckets",
  bucketsActions,
  loadFromServer
);

export default bucketsSlice;
