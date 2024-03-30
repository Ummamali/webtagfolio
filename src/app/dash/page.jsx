"use client";
import React from "react";
import { taggingEngine } from "../../../backend";
import { useSelector } from "react-redux";

export default function page() {
  const token = useSelector((state) => state.user.token);
  return (
    <div>
      <h2 className="text-gray-500">Dashboard</h2>
      <button
        className="btn-mainAccent"
        onClick={() => {
          async function func() {
            const res = await fetch(taggingEngine.urls.tagImage, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
              body: JSON.stringify({
                bucketName: "bucketone",
                mediaName: "cats.jpg",
                algo: "RESNET",
              }),
            });
            const resObj = await res.json();
            console.log(resObj);
          }

          func();
        }}
      >
        Run it
      </button>
    </div>
  );
}
