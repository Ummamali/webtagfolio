"use client";
import React, { useEffect, useState } from "react";
import ImageBox from "./ImageBox";
import SelectBucketDropdown from "./SelectBucketDropdown";
import { taggingEngine } from "../../../../../backend";
import { useDispatch, useSelector } from "react-redux";
import ImagePreview from "./ImagePreview";
import {
  flashedError,
  flashedInfo,
  flashedSuccess,
  imageRemoved,
  imagesAdded,
} from "../../../../store/ApplicationSlice";
import {
  bucketsActions,
  loadBucketsThunk,
} from "../../../../store/BucketsSlice";
import DetailEdditorModel from "./DetailEdditorModel";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getImageDimensions } from "../../../../utilFuncs/utilFuncs";

export default function UploadImage() {
  const token = useSelector((state) => state.user.token);
  const dispatchStore = useDispatch();
  const [imageFiles, setImageFiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [facialLoading, setFacialLoading] = useState(false);
  const [facialTags, setFacialTags] = useState({});
  const router = useRouter();
  const pathname = usePathname();

  const [bucketName, setBucketName] = useState(null);
  const [tagsObj, setTagsObj] = useState({});
  const bucketsState = useSelector((state) => state.buckets);
  const loadedImagesState = useSelector((state) => state.app.imageUpload);

  const [recognizedMediaNames, setRecognizedMediaNames] = useState([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    dispatchStore(loadBucketsThunk({ token: token }));
  }, []);

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
      .recognizeMediaItems(
        mediaNames,
        bucketName,
        token,
        tagsObj,
        bucketsState.indicesMap[bucketName]
      )
      .then((resObj) => {
        dispatchStore(
          flashedSuccess(`Successfully uploaded ${mediaNames.length} item(s)`)
        );
        setRecognizedMediaNames((prev) => [...prev, ...mediaNames]);
        const mediaItems = [];
        for (const name of mediaNames) {
          mediaItems.push({ title: name, path: "/", tags: tagsObj[name] });
        }
        dispatchStore(
          bucketsActions.newMediaAdded({
            bucketname: bucketName,
            mediaItems: mediaItems,
          })
        );
      })
      .catch((err) => {
        console.log(err);
        dispatchStore(flashedError("Unable to properly upload media items"));
      });
  }

  return (
    <div className="bg-mainDark px-4 py-6">
      {searchParams.get("detailEditor") === "true" ? (
        <DetailEdditorModel />
      ) : null}
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
          className="text-mainDark"
          multiple={true}
          onChange={(e) => {
            const selectedFiles = e.target.files;
            const dimensions = [];
            for (const file of selectedFiles) {
              dimensions.push(getImageDimensions(file));
            }
            Promise.all(dimensions).then((answer) => {
              const actionPayload = [];
              let i = 0;
              for (const file of selectedFiles) {
                actionPayload.push({ file: file, dimension: answer[i] });
                i += 1;
              }
              dispatchStore(imagesAdded(actionPayload));
            });
          }}
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

          <div className="divide-gray-500/30 divide-y">
            {loadedImagesState.data.length > 0 ? (
              loadedImagesState.data.map((item, idx) => (
                <div
                  key={`${item.name}-${idx}`}
                  className="flex items-center py-4 px-4 rounded-sm hover:bg-lightDark hover:cursor-pointer"
                  onClick={(e) => {
                    if (e.target.tagName !== "SPAN") {
                      router.push(
                        `${pathname}?detailEditor=true&imageName=${item.name}&bucketName=${bucketName}`
                      );
                    }
                  }}
                >
                  <ImagePreview
                    file={item.file}
                    className={"justify-self-start h-12 w-12"}
                  />
                  <h4 className=" text-gray-400/80 ml-4">{item.name}</h4>
                  <button
                    className="block justify-self-end ml-auto text-red-500/80"
                    onClick={() => {
                      dispatchStore(imageRemoved({ imageName: item.name }));
                    }}
                  >
                    <span className="material-symbols-outlined leading-none">
                      delete
                    </span>
                  </button>
                </div>
              ))
            ) : (
              <small className="text-gray-500 block text-center">
                No Images to be analyzed
              </small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
