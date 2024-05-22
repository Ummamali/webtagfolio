"use client";
import React, { useState, useEffect } from "react";
import { taggingEngine } from "../../../../../backend";
import { useDispatch, useSelector } from "react-redux";
import ChatBar from "./ChatBar";
import { messageSent, queriedBucketThunk } from "../../../../store/ChatsSlice";
import ChatViewer from "./ChatViewer";

export default function page({ params }) {
  const userState = useSelector((state) => state.user);
  const token = userState.token;
  const bucketName = params["bucketName"];
  const [query, setQuery] = useState({ text: "", now: null });

  const dispatchStore = useDispatch();

  useEffect(() => {
    if (query.text) {
      dispatchStore(queriedBucketThunk(query.text, bucketName));
    }
  }, [query]);
  return (
    <div className="flex flex-col items-stretch">
      <div className="px-4 py-2 rounded-sm flex items-center mb-2">
        <span class="material-symbols-outlined leading-none mr-2 text-gray-400/60">
          chat
        </span>
        <h2 className="text-gray-400/70 text-xl">{bucketName}</h2>
      </div>
      <ChatViewer bucketName={bucketName} />
      <ChatBar setQuery={setQuery} />
    </div>
  );
}
