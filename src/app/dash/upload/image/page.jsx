"use client";
import React, { useEffect, useState } from "react";
import ImageBox from "./ImageBox";

export default function UploadImage() {
  const [imageFiles, setImageFiles] = useState([]);

  // lists all the files when they are selected
  function listFiles(e) {
    // Access the files property of the file input element
    setImageFiles((prev) => {
      const newFiles = [...prev];

      // Iterate through the selected files
      const selectedFiles = e.target.files;
      for (let i = 0; i < selectedFiles.length; i++) {
        newFiles.push(selectedFiles[i]);
      }
      return newFiles;
    });
  }

  function uploadAllFiles() {
    // we do it sometime later
  }

  return (
    <div className="bg-mainDark px-4 py-6">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl text-gray-100/70">Upload an Image</h1>
          <p
            className={"text-green-500"}
          >
            <span className="material-symbols-outlined">check_circle</span>
          </p>
        </div>
        <small className="text-gray-100/30">
          Upload and save your important media assets to analyze them
          efficiently
        </small>
      </div>
      <div>
        <input
          type="file"
          id="fileInput"
          name="fileInput"
          accept=".jpg, .jpeg"
          className="text-gray-400"
          multiple={true}
          onChange={listFiles}
        />
        <div className="border border-gray-600 rounded p-4 my-3 space-y-2">
          {imageFiles.length > 0 ? (
            imageFiles.map((f) => <ImageBox file={f} key={f.name} />)
          ) : (
            <small className="text-gray-500 block text-center">
              No Images to be analyzed
            </small>
          )}
        </div>
      </div>
    </div>
  );
}
