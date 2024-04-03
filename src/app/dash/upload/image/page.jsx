"use client";
import React, { useEffect, useState } from "react";
import ImageBox from "./ImageBox";
import SelectBucketDropdown from "./SelectBucketDropdown";
import { taggingEngine } from "../../../../../backend";
import { useDispatch, useSelector } from "react-redux";
import {
  flashedError,
  flashedInfo,
  flashedSuccess,
} from "../../../../store/ApplicationSlice";
import {
  bucketsActions,
  loadBucketsThunk,
} from "../../../../store/BucketsSlice";

export default function UploadImage() {
  const token = useSelector((state) => state.user.token);
  const dispatchStore = useDispatch();
  const [imageFiles, setImageFiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [facialLoading, setFacialLoading] = useState(false);
  const [facialTags, setFacialTags] = useState({});

  const [bucketName, setBucketName] = useState(null);
  const [tagsObj, setTagsObj] = useState({});

  const [recognizedMediaNames, setRecognizedMediaNames] = useState([]);

  useEffect(() => {
    dispatchStore(loadBucketsThunk({ token: token }));
  }, []);

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
    if (selected.length === 0) {
      dispatchStore(flashedError("No selections"));
      return null;
    }
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

  function addTagToTagsObj(tagText, tagType, mediaName) {
    setTagsObj((prev) => {
      const newOne = JSON.parse(JSON.stringify(prev));
      if (newOne[mediaName] === undefined) {
        newOne[mediaName] = { object: [], person: [] };
      }
      newOne[mediaName][tagType].push(tagText);
      return newOne;
    });
  }

  function removeTagFromTagsObj(tagText, tagType, mediaName) {
    setTagsObj((prev) => {
      const newOne = JSON.parse(JSON.stringify(prev));
      newOne[mediaName][tagType] = newOne[mediaName][tagType].filter(
        (t) => t !== tagText
      );
      return newOne;
    });
  }

  function sendForRecognition() {
    if (bucketName === null) {
      dispatchStore(flashedError("Please select a bucket to upload"));
      return null;
    }
    // we do it sometime later
    const mediaNames = selected.map((i) => imageFiles[i].name);
    if (mediaNames.length === 0) {
      dispatchStore(flashedInfo("No media to upload"));
      return null;
    }
    // if the user tries to recognize an unanalyzed file
    for (const name of mediaNames) {
      if (tagsObj[name] === undefined) {
        dispatchStore(flashedInfo(`Please add atleast one tag for ${name}`));
        return null;
      }

      if (recognizedMediaNames.includes(name)) {
        dispatchStore(flashedInfo(`${name} has been uploaded, unmark it`));
        return null;
      }
    }

    // all good
    taggingEngine.handlers
      .recognizeMediaItems(mediaNames, bucketName, token, tagsObj)
      .then((resObj) => {
        dispatchStore(
          flashedSuccess(`Successfully uploaded ${mediaNames.length} item(s)`)
        );
        setRecognizedMediaNames((prev) => [...prev, ...mediaNames]);
      })
      .catch((err) =>
        dispatchStore(flashedError("Unable to properly upload media items"))
      );
  }

  return (
    <div className="bg-mainDark px-4 py-6">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl text-gray-100/70 mb-1">Upload an Image</h1>
        </div>
        <p className="mb-3">
          <small className="text-gray-100/30">
            Upload and save your important media assets to analyze them
            efficiently
          </small>
        </p>
        <SelectBucketDropdown
          bucketName={bucketName}
          setBucketName={setBucketName}
        />
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
          <div className="flex items-center justify-between">
            <h3 className="text-2xl text-gray-100/70 mb-4">Media Items</h3>
            <div className="flex items-center">
              <button
                className={
                  "btn border border-mainAccent text-mainAccent mr-2 text-sm " +
                  (facialLoading ? "animate-bounce" : "")
                }
                disabled={facialLoading}
                onClick={doFacialRecognition}
              >
                {facialLoading ? "Loading..." : "Find People"}
              </button>
              <button
                className={
                  "btn px-10 bg-mainAccent text-white/90 " +
                  (facialLoading ? "animate-bounce" : "")
                }
                onClick={sendForRecognition}
              >
                Upload
              </button>
            </div>
          </div>
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
                addTagToTagsObj={addTagToTagsObj}
                removeTagFromTagsObj={removeTagFromTagsObj}
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
