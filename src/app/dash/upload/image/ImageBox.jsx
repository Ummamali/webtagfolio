import React, { useState } from "react";
import ImagePreview from "./ImagePreview";
import { taggingEngine } from "../../../../../backend";
import { useDispatch, useSelector } from "react-redux";
import { flashedError } from "../../../../store/ApplicationSlice";
import TagBox from "./TagBox";

export default function ImageBox({ file }) {
  const [selectedObjectTags, setSelectedObjectTags] = useState([]);
  const [objectTags, setObjectTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [askMore, setAskMore] = useState(true);

  const token = useSelector((state) => state.user.token);
  const dispatchStore = useDispatch();

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
      setObjectTags(tagsResObj[0].tags);
      setIsLoading(false);
    }

    // Now we are actually deling with it
    setIsLoading(true);
    contactServer().catch((error) => {
      dispatchStore(flashedError("Failed to analyze file"));
      setIsLoading(false);
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
    setSelectedObjectTags((prev) => [...prev, idx]);
  }

  return (
    <div
      className={
        "flex bg-white/5 p-3 rounded shadow " +
        (isLoading ? "animate-pulse-fast" : "")
      }
    >
      <ImagePreview file={file} size={{ height: "130px" }} />
      <div className="flex-1 px-3">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-gray-400">{file.name}</h2>
            <small className="text-gray-400/80 block -mt-1">{file.type}</small>
          </div>

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
        <div className="w-full overflow-x-hidden">
          {objectTags.length > 0 ? (
            <div>
              <p className="text-gray-400 mb-2">Objects</p>
              <div className="flex items-center flex-wrap">
                {objectTags.map((o, i) =>
                  selectedObjectTags.includes(i) ? null : (
                    <TagBox text={o} idx={i} gotSelected={gotSelected} />
                  )
                )}
                {askMore ? (
                  <button
                    className="text-gray-500 italic text-sm"
                    onClick={askMoreTags}
                    disabled={isLoading}
                  >
                    load more
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
