import React, { useState } from "react";
import ImagePreview from "./ImagePreview";
import { taggingEngine } from "../../../../../backend";
import { useDispatch, useSelector } from "react-redux";
import { flashedError } from "../../../../store/ApplicationSlice";
import {
  findClosestColorName,
  getPrimaryColors,
} from "../../../../utilFuncs/utilFuncs";
import TagBox from "./TagBox";

export default function ImageBox({
  file,
  markSelected,
  unmarkSelected,
  selected,
  idx,
  myFacialTags,
  addTagToTagsObj,
  removeTagFromTagsObj,
}) {
  const [selectedObjectTags, setSelectedObjectTags] = useState([]);
  const [objectTags, setObjectTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [askMore, setAskMore] = useState(true);

  const [selectedFacialTags, setSelectedFacialTags] = useState([]);

  const token = useSelector((state) => state.user.token);
  const dispatchStore = useDispatch();

  const isSelected = selected.includes(idx);

  const detectObjects = async (imageFile) => {
    const imageUrl = URL.createObjectURL(imageFile);
    const imageElement = document.createElement("img");
    imageElement.src = imageUrl;
    const model = await cocoSsd.load();
    const predictions = await model.detect(imageElement);
    return predictions;
  };

  function uploaFile() {
    async function contactServer() {
      const saveResObj = await taggingEngine.handlers.sendImagesToEngine(
        [file],
        token
      );
      const tagsResObj = await taggingEngine.handlers.askTags(
        [file.name],
        "_temp",
        token
      );
      setObjectTags((prev) => [...prev, ...tagsResObj[0].tags]);
      setIsLoading(false);
    }

    // Now we are actually deling with it
    setIsLoading(true);
    contactServer().catch((error) => {
      dispatchStore(flashedError("Failed to analyze file"));
      setIsLoading(false);
    });
    getPrimaryColors(file).then((clrs) => {
      const colorNames = clrs.map((c) =>
        findClosestColorName(c[0], c[1], c[2])
      );
      const uniqueColorNames = [...new Set(colorNames)].map(
        (c) => `color: ${c}`
      );
      setObjectTags((prev) => [...prev, ...uniqueColorNames]);
    });
  }

  function askMoreTags() {
    async function contactServer() {
      const tagsResObj = await taggingEngine.handlers.askTags(
        [file.name],
        "_temp",
        token,
        "DENSENET"
      );
      setObjectTags((prev) => [...prev, ...tagsResObj[0].tags]);
      setIsLoading(false);
      setAskMore(false);
    }

    // Now we are actually deling with it
    setIsLoading(true);
    contactServer().catch((error) => {
      dispatchStore(flashedError("Failed to load more tags"));
      setIsLoading(false);
    });
  }

  function gotSelected(idx) {
    addTagToTagsObj(objectTags[idx], "objects", file.name);
    setSelectedObjectTags((prev) => [...prev, idx]);
  }

  function gotUnselected(idx) {
    removeTagFromTagsObj(objectTags[idx], "objects", file.name);
    setSelectedObjectTags((prev) => prev.filter((i) => i !== idx));
  }

  function facialGotSelected(idx) {
    addTagToTagsObj(myFacialTags[idx], "people", file.name);
    setSelectedFacialTags((prev) => [...prev, idx]);
  }

  function facialGotUnselected(idx) {
    removeTagFromTagsObj(myFacialTags[idx], "people", file.name);
    setSelectedFacialTags((prev) => prev.filter((i) => i !== idx));
  }

  return (
    <div className="flex bg-lightDark px-6 py-6 rounded shadow">
      <ImagePreview
        file={file}
        size={{ height: "130px" }}
        className={isLoading ? "animate-pulse-fast" : ""}
      />
      <div className="flex-1 px-3">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-gray-400">{file.name}</h2>
            <small className="text-gray-400/80 block -mt-1">{file.type}</small>
          </div>
          <div className="flex items-center">
            <button
              className={
                "btn text-sm p-0 rounded-sm mr-4 border leading-none " +
                (isSelected
                  ? "bg-mainAccent text-black/70 border-transparent"
                  : "text-gray-400 border-gray-500")
              }
              onClick={() =>
                isSelected ? unmarkSelected(idx) : markSelected(idx)
              }
            >
              <span className="material-symbols-outlined">done</span>
            </button>

            {objectTags.length === 0 ? (
              <button
                className={
                  "border border-mainAccent text-mainAccent py-2 px-4 rounded text-sm disabled:opacity-30 "
                }
                onClick={uploaFile}
                disabled={isLoading}
              >
                Analyze
              </button>
            ) : null}
          </div>
        </div>
        {/* Objects tags section */}
        <div className="w-full overflow-x-hidden">
          {objectTags.length > 0 ? (
            <div>
              <p className="text-gray-400/80 mb-2 text-xl">Objects</p>
              <div className="flex items-center flex-wrap border-b border-dashed border-gray-400/70 pb-2">
                {selectedObjectTags.length > 0
                  ? selectedObjectTags
                      .map((i) => ({ tag: objectTags[i], idx: i }))
                      .map(({ tag, idx }) => (
                        <button
                          className="border border-purple-500 shadow py-1 px-2 rounded-sm text-purple-500 text-sm mr-2 hover:border-gray-400 hover:text-gray-400"
                          onClick={() => gotUnselected(idx)}
                        >
                          {tag}
                        </button>
                      ))
                  : null}
              </div>
              <div className="flex items-center flex-wrap">
                {objectTags.map((o, i) =>
                  selectedObjectTags.includes(i) ? null : (
                    <TagBox
                      text={o}
                      idx={i}
                      gotSelected={gotSelected}
                      key={o + i}
                    />
                  )
                )}
                {askMore ? (
                  <button
                    className="text-gray-500 italic text-sm mt-2"
                    onClick={askMoreTags}
                    disabled={isLoading}
                  >
                    {isLoading ? "loading..." : "load more"}
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
        {/* People tags section */}
        <div className="mt-3">
          <h3 className="text-gray-400/80 text-xl mb-2">People</h3>
          {/* Selected facial tags */}
          <div className="flex border-b border-dashed border-gray-400 pb-2">
            {myFacialTags !== null && myFacialTags.length > 0
              ? myFacialTags.map((txt, idx) =>
                  selectedFacialTags.includes(idx) ? (
                    <button
                      className="border border-purple-500 shadow py-1 px-2 rounded-sm text-purple-500 text-sm mr-2 hover:border-gray-400 hover:text-gray-400"
                      onClick={() => facialGotUnselected(idx)}
                    >
                      {txt}
                    </button>
                  ) : null
                )
              : null}
          </div>
          {myFacialTags === null ? (
            <p className="text-gray-500 italic">
              <small>Not generated yet</small>
            </p>
          ) : (
            <div className="flex">
              {myFacialTags.length > 0 ? (
                myFacialTags.map((name, i) =>
                  selectedFacialTags.includes(i) ? null : (
                    <TagBox
                      text={name}
                      key={name + i}
                      gotSelected={facialGotSelected}
                      idx={i}
                    />
                  )
                )
              ) : (
                <p className="text-red-700/70 italic mt-1">
                  <small>0 known persons in this image</small>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
