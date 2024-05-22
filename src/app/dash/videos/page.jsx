"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { taggingEngine } from "../../../../backend";

export default function page() {
  const [videos, setVideos] = useState({ loadStatus: 0, list: [] });
  const userState = useSelector((state) => state.user);
  const userId = userState.userId;
  useEffect(() => {
    setVideos({ loadStatus: 1, list: [] });
    fetch(`${taggingEngine.urls.getVideoData}/${userId}`)
      .then((res) => res.json())
      .then((resObj) => setVideos({ loadStatus: 2, list: resObj }))
      .catch((err) => setVideos({ loadStatus: 3, list: [] }));
  }, []);
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-gray-300/80 font-light text-3xl">Video Bucket</h2>
        <p className="text-gray-500/70 text-sm">
          Videos are all stored in a single bucket
        </p>
      </div>
      {videos.loadStatus === 1 ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : null}
      <div className="divide-y divide-gray-500/20">
        {videos.list.map((vid) => (
          <div className="px-2 py-3">
            <div className="flex space-x-2 items-center mb-2">
              <span className="material-symbols-outlined leading-none text-gray-400/60">
                play_arrow
              </span>
              <p className="text-lg text-gray-400/80">{vid.title}</p>
            </div>
            <div className="flex flex-wrap">
              {vid.tags.map((t) => (
                <p className="text-mainAccent border border-mainAccent py-0.5 px-4 rounded-sm mr-3 mb-3">
                  {t}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
