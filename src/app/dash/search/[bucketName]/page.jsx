"use client";
import React from "react";
import { taggingEngine } from "../../../../../backend";
import { useSelector } from "react-redux";

export default function page({ params }) {
  const userState = useSelector((state) => state.user);
  const token = userState.token;
  const bucketName = params["bucketName"];
  return (
    <div>
      <button
        onClick={() => {
          fetch(taggingEngine.urls.chatSearch, {
            method: "POST",
            body: JSON.stringify({
              bucketName: bucketName,
              query: "flowers tree wall",
            }),
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          });
        }}
      >
        Run It
      </button>
    </div>
  );
}
