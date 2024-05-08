"use client";
import React from "react";
import { useSelector } from "react-redux";

export default function BucketExplorer({ params }) {
  const bucketState = useSelector((state) => state.buckets);
  const thisBucket =
    bucketState.dataItems[bucketState.indicesMap[params.bucketname]];
  return (
    <div>
      <div>
        <div className="text-yellow-600/80 -ml-0.5">
          {Array.from("x".repeat(thisBucket.stars)).map((s) => (
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "20px" }}
            >
              star
            </span>
          ))}
        </div>
        <div className="flex items-center">
          <span
            className="material-symbols-outlined text-gray-400 leading-none"
            style={{ fontSize: "30px" }}
          >
            folder_open
          </span>
          <h2 className="text-gray-400 text-3xl font-light ml-2">
            {params.bucketname}
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          View and modify bucket items here
        </p>
      </div>
    </div>
  );
}
