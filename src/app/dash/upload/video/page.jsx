"use client";
import React, { useRef, useState } from "react";
import { taggingEngine } from "../../../../../backend";
import { useSelector } from "react-redux";
import { title } from "process";

const VideoUploader = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const userState = useSelector((state) => state.user);
  const [tags, setTags] = useState([]);
  const inputRef = useRef();
  const userId = userState.userId;

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedVideo(file);
      setVideoURL(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedVideo) {
      setUploadMessage("No video selected for upload.");
      return;
    }
    console.log(selectedVideo);
    const res = await fetch(taggingEngine.urls.uploadVideoData, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        title: selectedVideo.name,
        tags: tags,
      }),
    });

    if (res.ok) {
      const formData = new FormData();
      formData.append("video", selectedVideo);

      try {
        const response = await fetch(
          `${taggingEngine.urls.uploadVideo}/${userId}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUploadMessage(`Upload successful: ${data.message}`);
        } else {
          const errorData = await response.json();
          setUploadMessage(`Upload failed: ${errorData.error}`);
        }
      } catch (error) {
        setUploadMessage(`Upload failed: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-gray-300/80 font-light text-3xl">Upload Video</h2>
        <p className="text-gray-500/70 text-sm">
          Videos are all stored in a single bucket
        </p>
      </div>
      <div className="flex items-center justify-between mb-4">
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="text-mainDark"
        />
        <button onClick={handleUpload} className="btn btn-mainAccent">
          Upload Video
        </button>
      </div>
      {uploadMessage && (
        <p className="text-gray-400/70 text-center text-sm">{uploadMessage}</p>
      )}
      {videoURL && (
        <div>
          <video height={"300"} controls className="block mx-auto mb-4">
            <source src={videoURL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="flex items-center flex-wrap">
            {tags.map((t) => (
              <p className="text-sm border border-mainAccent text-mainAccent py-2 px-4 rounded-sm mr-3 mb-3">
                {t}
              </p>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (inputRef.current.value !== "") {
                  const nowValue = inputRef.current.value;
                  setTags((prev) => [...prev, nowValue]);
                  inputRef.current.value = "";
                }
              }}
            >
              <input
                type="text"
                className="text-sm min-w-[200px] placeholder:italic mb-3"
                placeholder="type tags here"
                ref={inputRef}
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
