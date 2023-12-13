"use client";
import React, { useState } from "react";
import ImagePreview from "./ImagePreview";

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
    <div>
      <h1>Upload Image Page</h1>
      <div>
        <input
          type="file"
          id="fileInput"
          name="fileInput"
          accept=".jpg, .jpeg"
          multiple={true}
          onChange={listFiles}
        />
        <div>
          {imageFiles.map((f) => (
            <ImagePreview file={f} size={{ height: "100px" }} />
          ))}
        </div>

        <button
          type="submit"
          className="bg-green-500 p-4"
          onClick={uploadAllFiles}
        >
          Save All
        </button>
      </div>
    </div>
  );
}
