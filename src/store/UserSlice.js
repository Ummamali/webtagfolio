import { createSlice } from "@reduxjs/toolkit";
import { simpleBackend } from "../../backend";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    token: null,
    userData: { featuredBuckets: [] },
  },
  reducers: {
    userIdentified: (state, action) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.username = action.payload.username;
    },
    userDataLoaded: (state, action) => {
      state.userData = action.payload;
    },
  },
});

async function fetchUserData(token) {
  const res = await fetch(simpleBackend.urls.userData, {
    method: "GET",
    headers: { Authorization: token },
  });

  if (res.ok) {
    const resObj = await res.json();
    return resObj;
  }
}

// Action creators are generated for each case reducer function
export const { userIdentified, userDataLoaded } = userSlice.actions;

export function userDataLoadedThunk(token) {
  return (dispatch) => {
    fetchUserData(token).then((resObj) => {
      dispatch(userDataLoaded(resObj));
    });
  };
}

export default userSlice.reducer;
