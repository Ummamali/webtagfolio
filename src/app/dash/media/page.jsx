// page.jsx
"use client";

import React, { useState } from "react";
import ImageBox from "./ImageBox";

export default function UploadImage() {
  const [imageFiles, setImageFiles] = useState([]);

  function listFiles(e) {
    const newFiles = Array.from(e.target.files);
    setImageFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }

  return (
    <div className="bg-mainDark px-4 py-8">
      <div className="mb-4">
        <div>
          <h1 className="text-3xl text-gray-100/70 mb-1">Upload an Image</h1>
        </div>
      </div>
      <div>
        <input
          type="file"
          id="fileInput"
          name="fileInput"
          accept=".jpg, .jpeg"
          className="text-gray-400"
          multiple
          onChange={listFiles}
        />
        <div className="border border-purple-100 bg-purple-900 rounded p-4 my-3 space-y-2">
          {imageFiles.length > 0 ? (
            imageFiles.map((file, index) => (
              <ImageBox file={file} key={index} />
            ))
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
