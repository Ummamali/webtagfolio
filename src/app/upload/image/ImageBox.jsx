import React, { useState } from "react";
import ImagePreview from "./ImagePreview";

export default function ImageBox({ file }) {
  const [tags, setTags] = useState(null);
  console.log(tags);
  function uploaFile() {
    // Create a FormData object to hold the files
    const formData = new FormData();

    // Append file to the FormData object
    formData.append("files", file);
    setTags("loading");
    // Make a Fetch API request to send files to the server
    fetch("http://127.0.0.1:5500/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Upload successful:", data);
        setTags(data.tags[file.name]);
        // Handle the server's response if needed
      })
      .catch((error) => {
        console.error("Error during upload:", error);
      });
  }

  const isLoading = tags === "loading";

  return (
    <div
      className={
        "flex bg-white/5 p-3 rounded shadow " +
        (isLoading ? "animate-pulse-fast" : "")
      }
    >
      <ImagePreview file={file} size={{ height: "140px" }} />
      <div className="flex-1 px-3">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-gray-400">{file.name}</h2>
            <small className="text-gray-400/80 block -mt-1">{file.type}</small>
          </div>
          <button
            className={
              "bg-mainAccent text-white py-2 px-4 rounded text-sm " +
              (isLoading ? "bg-gray-400/20" : "")
            }
            onClick={uploaFile}
            disabled={isLoading}
          >
            Analyze
          </button>
        </div>
        <div>
          <div className="flex space-x-1">
            {tags === null || tags === "loading" ? (
              <p className="text-sm text-gray-500 italic">
                No People to show yet
              </p>
            ) : (
              tags.present.map((person) => (
                <div
                  key={person.personId}
                  className="inline-block text-purple-400 text-sm border border-purple-400 py-1 px-4 rounded-md"
                >
                  <p>{person.name[0]}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
