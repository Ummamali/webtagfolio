import React, { useState } from "react";
import Model from "../../../util/Model";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import ImageItemSelector from "./ImageItemSelector";
import Dropdown from "../../../util/Dropdown";
import ProvisionalSuggSelector from "./ProvisionalSuggSelector";
import OverallSuggestions from "./OverallSuggestions";
import { formatFileSize, truncateText } from "../../../../utilFuncs/utilFuncs";
import {
  loadOverallFacesThunk,
  loadOverallObjectsThunk,
} from "../../../../store/ApplicationSlice";

const options = ["select", "edit"];

export default function DetailEdditorModel() {
  const [modeIdx, setModeIdx] = useState(0);
  const searchParams = useSearchParams();
  const dispatchStore = useDispatch();
  const router = useRouter();
  const uploadingImagesState = useSelector(
    (state) => state.app.imageUpload.data
  );
  const thisImage = uploadingImagesState.find(
    (item) => item.name === searchParams.get("imageName")
  );

  function close() {
    router.back();
  }
  return (
    <Model close={close}>
      <div className="bg-mainDark w-[90vw] h-[90vh] mx-auto mt-4 flex items-stretch">
        <div className="flex-1">
          <div className="flex justify-center items-center py-4">
            <p className="text-sm text-gray-400/70 mr-2">Selection mode</p>
            <Dropdown
              options={options}
              currentOption={modeIdx}
              setCurrentOption={setModeIdx}
            />
          </div>
          <ImageItemSelector thisImage={thisImage} modeIdx={modeIdx} />
        </div>
        <div className="bg-gray-400/5 px-6 py-4 min-w-[400px]">
          <div className="mb-6">
            <div className="flex items-center">
              <span className="material-symbols-outlined mr-2 text-gray-400/90">
                image
              </span>
              <h2 className="text-xl text-gray-400">
                {truncateText(thisImage.name, 24)}
              </h2>
            </div>
            <p className="mb-2 text-gray-400/50">
              {formatFileSize(thisImage.file.size)}
            </p>

            <div className="flex items-center space-x-2 mb-2">
              <button
                className="btn btn-mainAccent flex-1"
                onClick={() => {
                  dispatchStore(
                    loadOverallFacesThunk(thisImage.file, thisImage.name)
                  );
                }}
              >
                Find People
              </button>
              <button
                className="btn btn-mainAccent flex-1"
                onClick={() => {
                  dispatchStore(
                    loadOverallObjectsThunk(thisImage.file, thisImage.name)
                  );
                }}
              >
                Analyze
              </button>
            </div>
            <button className="btn btn-mainAccent w-full">Upload Image</button>
          </div>
          {thisImage.provisionalBox !== null ? (
            <ProvisionalSuggSelector
              provisionalSuggestions={thisImage.provisionalSuggestions}
              thisImageName={thisImage.name}
              selectedSuggestionIds={thisImage.selectedSuggestionIds}
            />
          ) : (
            <OverallSuggestions thisImage={thisImage} />
          )}
        </div>
      </div>
    </Model>
  );
}
