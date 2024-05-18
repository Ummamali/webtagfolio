import React, { useState } from "react";
import Model from "../../../util/Model";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import ImageItemSelector from "./ImageItemSelector";
import Dropdown from "../../../util/Dropdown";
import ProvisionalSuggSelector from "./ProvisionalSuggSelector";

const options = ["select", "edit"];

export default function DetailEdditorModel() {
  const [modeIdx, setModeIdx] = useState(0);
  const searchParams = useSearchParams();
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
          <div>
            <Dropdown
              options={options}
              currentOption={modeIdx}
              setCurrentOption={setModeIdx}
            />
          </div>
          <ImageItemSelector thisImage={thisImage} modeIdx={modeIdx} />
        </div>
        <div className="bg-gray-400/5 px-6 py-4 min-w-[400px]">
          <h2>{thisImage.name}</h2>
          {thisImage.provisionalBox !== null ? (
            <ProvisionalSuggSelector
              provisionalSuggestions={thisImage.provisionalSuggestions}
              thisImageName={thisImage.name}
              selectedSuggestionIds={thisImage.selectedSuggestionIds}
            />
          ) : null}
        </div>
      </div>
    </Model>
  );
}
