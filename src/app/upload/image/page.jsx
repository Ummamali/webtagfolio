"use client";
import React, { useState } from "react";
import ImageBox from "./ImageBox";

export default function UploadImage() {
  const [imageFiles, setImageFiles] = useState([]);
  console.log(imageFiles);

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
    // Create a FormData object to hold the files
    const formData = new FormData();

    // Append each selected file to the FormData object
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append("files", imageFiles[i]);
    }

    // Make a Fetch API request to send files to the server
    fetch("http://127.0.0.1:5500/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Upload successful:", data);
        // Handle the server's response if needed
      })
      .catch((error) => {
        console.error("Error during upload:", error);
      });
  }

  return (
    <div className="bg-mainDarkBG min-h-screen w-screen px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl text-gray-100/70">Upload an Image</h1>
        <small className="text-gray-100/50">
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
