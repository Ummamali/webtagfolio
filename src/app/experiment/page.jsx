"use client";
import React, { useState } from "react";
import ImageItemSelector from "./ImageItemSelector";
import Dropdown from "../util/Dropdown";

const options = ["select", "edit"];

export default function DevComponentPage() {
  // Each box is represented by an object of shape {tag: "some_tag", box: [x, y, width, height]}
  const [boxes, setBoxes] = useState([
    { tag: "bench", box: [20, 20, 200, 300] },
  ]);
  const [modeIdx, setModeIdx] = useState(0);

  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch(
        "http://192.168.10.67:5501/image/tags/facial/singleface",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        console.log("Image uploaded successfully!");
      } else {
        console.error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-white p-8 min-h-screen">
      <h1 className="text-red-800 text-4xl">This is an experimental page</h1>
      <div>
        <Dropdown
          options={options}
          currentOption={modeIdx}
          setCurrentOption={setModeIdx}
        />
      </div>
      <ImageItemSelector boxes={boxes} setBoxes={setBoxes} modeIdx={modeIdx} />
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
