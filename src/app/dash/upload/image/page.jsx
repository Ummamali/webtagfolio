"use client";
import React, { useEffect, useState } from "react";
import ImageBox from "./ImageBox";
import { taggingEngine } from "../../../../../backend";
import { useSelector } from "react-redux";

export default function UploadImage() {
  const token = useSelector((state) => state.user.token);
  const [imageFiles, setImageFiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [facialLoading, setFacialLoading] = useState(false);
  const [facialTags, setFacialTags] = useState({});

  function markSelected(idx) {
    setSelected((prev) => [...prev, idx]);
  }

  function unmarkSelected(idx) {
    setSelected((prev) => prev.filter((value) => value !== idx));
  }

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

  function doFacialRecognition() {
    // First we save the files
    setFacialLoading(true);
    taggingEngine.handlers
      .sendImagesToEngine(
        selected.map((i) => imageFiles[i]),
        token
      )
      .then((resObj) => {
        // Then we perform facial taggings
        taggingEngine.handlers
          .askFacialTags(
            selected.map((i) => imageFiles[i]).map((img) => img.name),
            "_temp",
            token
          )
          .then((resObj) => {
            const tags = {};
            for (const key in resObj) {
              const nameTags = resObj[key].present.map((n) => n.name);
              const flatFacialTags = [];
              for (const person in nameTags) {
                const names = nameTags[person];
                for (const name of names) {
                  flatFacialTags.push(name);
                }
              }

              tags[key] = flatFacialTags;
            }

            setFacialTags((prev) => ({ ...prev, ...tags }));
            setFacialLoading(false);
          });
      })
      .catch((err) => {
        setFacialLoading(false);
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
          <button
            className={
              "btn border border-mainAccent text-mainAccent " +
              (facialLoading ? "animate-bounce" : "")
            }
            disabled={facialLoading}
            onClick={doFacialRecognition}
          >
            {facialLoading ? "Loading..." : "Find People"}
          </button>
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
        <div className="space-y-4 mt-6">
          {imageFiles.length > 0 ? (
            imageFiles.map((f, idx) => (
              <ImageBox
                file={f}
                idx={idx}
                key={f.name}
                markSelected={markSelected}
                unmarkSelected={unmarkSelected}
                selected={selected}
                myFacialTags={facialTags[f.name] ? facialTags[f.name] : null}
              />
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
