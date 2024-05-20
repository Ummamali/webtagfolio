import React from "react";
import { useDispatch } from "react-redux";
import {
  overallSuggestionGotSelected,
  overallSuggestionGotUnselected,
} from "../../../../store/ApplicationSlice";
import Image from "next/image";

export default function OverallSuggestions({ thisImage }) {
  const dispatchStore = useDispatch();
  const selectedPeopleTagsIndices =
    thisImage.overallSuggestions.suggestions.people.selectedIdcs;
  const selectedObjectTagsIndices =
    thisImage.overallSuggestions.suggestions.object.selectedIdcs;
  return (
    <div>
      <main className="mb-6">
        <div className="flex items-center mb-3">
          <h3 className="text-gray-400/80">Suggested People</h3>
          {thisImage.overallSuggestions.loadStatus.people === 1 ? (
            <Image
              width={20}
              height={20}
              src={"/loading.gif"}
              className="ml-2 opacity-90"
            />
          ) : null}

          <p className="text-mainAccent text-sm ml-auto">
            ({selectedPeopleTagsIndices.length})
          </p>
        </div>
        <div className="border border-gray-500/20 shadow-lg rounded px-2 py-4 grid grid-cols-2 gap-2 items-start min-h-[100px] max-h-[300px] overflow-y-scroll myScrollbar">
          {thisImage.overallSuggestions.suggestions.people.list.map(
            (item, idx) => (
              <div
                className={
                  "w-full text-gray-400/60 py-2 px-4 border border-gray-500/30 rounded hover:cursor-pointer hover:bg-black/10 text-sm " +
                  (selectedPeopleTagsIndices.includes(idx)
                    ? "border-mainAccent/70 !text-mainAccent"
                    : "")
                }
                key={`${item} - ${idx}`}
                onClick={() => {
                  if (selectedPeopleTagsIndices.includes(idx)) {
                    dispatchStore(
                      overallSuggestionGotUnselected({
                        imageName: thisImage.name,
                        tagType: "people",
                        idx: idx,
                      })
                    );
                  } else {
                    dispatchStore(
                      overallSuggestionGotSelected({
                        imageName: thisImage.name,
                        tagType: "people",
                        idx: idx,
                      })
                    );
                  }
                }}
              >
                {item}
              </div>
            )
          )}
        </div>
      </main>
      <main className="">
        <div className="flex items-center mb-3">
          <h3 className="text-gray-400/80">Suggested Tags</h3>
          {thisImage.overallSuggestions.loadStatus.object === 1 ? (
            <Image
              width={20}
              height={20}
              src={"/loading.gif"}
              className="ml-2 opacity-90"
            />
          ) : null}
          <p className="text-mainAccent text-sm ml-auto">
            ({selectedObjectTagsIndices.length})
          </p>
        </div>
        <div className="border border-gray-500/20 shadow-lg rounded px-2 py-4 grid grid-cols-2 gap-2 items-start min-h-[100px] max-h-[300px] overflow-y-scroll myScrollbar">
          {thisImage.overallSuggestions.suggestions.object.list.map(
            (item, idx) => (
              <div
                className={
                  "w-full text-gray-400/60 py-2 px-4 border border-gray-500/30 rounded hover:cursor-pointer hover:bg-black/10 text-sm " +
                  (selectedObjectTagsIndices.includes(idx)
                    ? "border-mainAccent/70 !text-mainAccent"
                    : "")
                }
                key={`${item} - ${idx}`}
                onClick={() => {
                  if (selectedObjectTagsIndices.includes(idx)) {
                    dispatchStore(
                      overallSuggestionGotUnselected({
                        imageName: thisImage.name,
                        tagType: "object",
                        idx: idx,
                      })
                    );
                  } else {
                    dispatchStore(
                      overallSuggestionGotSelected({
                        imageName: thisImage.name,
                        tagType: "object",
                        idx: idx,
                      })
                    );
                  }
                }}
              >
                {item}
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
