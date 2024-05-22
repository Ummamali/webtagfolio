import { createSlice } from "@reduxjs/toolkit";
import { taggingEngine } from "../../backend";

function getTailoredReply(mediaIdcs) {
  if (mediaIdcs.length === 0) {
    return "Sorry! we are unable to find any item. Can you please be more specific?";
  } else {
    return "Here are the media items according to your query";
  }
}
const ChatsSlice = createSlice({
  name: "chats",
  initialState: {
    __agent_thinking: false,
  },
  reducers: {
    initializeChats: (state, action) => {
      if (state[action.payload.bucketName] === undefined) {
        state[action.payload.bucketName] = [];
      }
    },
    messageSent: (state, action) => {
      state[action.payload.bucketName].unshift({
        type: "QUERY",
        text: action.payload.text,
      });
    },
    started_thinking: (state) => {
      state.__agent_thinking = true;
    },
    stoped_thinking: (state) => {
      state.__agent_thinking = false;
    },
    messageRecieved: (state, action) => {
      state[action.payload.bucketName].unshift({
        type: "REPLY",
        text: getTailoredReply(action.payload.mediaIdcs),
        mediaIdcs: action.payload.mediaIdcs,
      });
    },
  },
});

export const {
  messageSent,
  initializeChats,
  started_thinking,
  stoped_thinking,
  messageRecieved,
} = ChatsSlice.actions;

export default ChatsSlice.reducer;

export function queriedBucketThunk(query, bucketName) {
  return (dispatch, getState) => {
    const userState = getState().user;
    const token = userState.token;
    console.log(token);
    async function contactServer() {
      const res = await fetch(taggingEngine.urls.chatSearch, {
        method: "POST",
        body: JSON.stringify({
          bucketName: bucketName,
          query: query,
        }),
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const resObj = await res.json();
        const mediaIdcs = Array.from(
          new Set(resObj.scores.map((item) => item[0]))
        );

        dispatch(stoped_thinking());
        dispatch(
          messageRecieved({ bucketName: bucketName, mediaIdcs: mediaIdcs })
        );
      }
    }

    dispatch(messageSent({ bucketName: bucketName, text: query }));
    dispatch(started_thinking());
    contactServer().catch((err) => {
      console.log(err);
      dispatch(stoped_thinking());
    });
  };
}
