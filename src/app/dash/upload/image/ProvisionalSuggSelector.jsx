import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import {
  flashedSuccess,
  pBoxSaved,
  provisionalBoxDestroyed,
  suggestionGotSelected,
  suggestionGotUnselected,
  userSuggested,
} from "../../../../store/ApplicationSlice";

export default function ProvisionalSuggSelector({
  provisionalSuggestions,
  thisImageName,
  selectedSuggestionIds,
}) {
  const dispatchStore = useDispatch();
  const inputRef = useRef();
  return (
    <div className="pt-4">
      <div className="flex items-center mb-4 ">
        <h4 className="text-gray-400/90 text-lg">Suggestions</h4>
        <button
          className="ml-auto flex items-center mr-3 text-gray-400 hover:text-red-500"
          onClick={() =>
            dispatchStore(provisionalBoxDestroyed({ imageName: thisImageName }))
          }
        >
          <span className="material-symbols-outlined leading-none">close</span>
        </button>
        <button
          className="text-sm btn btn-mainAccent"
          onClick={() => {
            dispatchStore(pBoxSaved({ imageName: thisImageName }));
            dispatchStore(flashedSuccess("Selection has been saved"));
            dispatchStore(
              provisionalBoxDestroyed({ imageName: thisImageName })
            );
          }}
        >
          Save Box
        </button>
      </div>
      <form
        className="mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          dispatchStore(
            userSuggested({
              imageName: thisImageName,
              suggestion: inputRef.current.value,
            })
          );
          inputRef.current.value = "";
        }}
      >
        <input
          ref={inputRef}
          className="text-gray-400 bg-transparent border-b border-gray-400/10 focus:outline-none  focus:border-gray-400 px-2 py-1 block w-full placeholder:text-gray-400/50 placeholder:italic"
          placeholder="Enter your tag and press enter"
        />
      </form>
      <div>
        <div className="h-[600px] border border-gray-500/20 shadow-lg rounded px-2 py-4 overflow-y-scroll myScrollbar grid grid-cols-2 auto-rows-min gap-2">
          {provisionalSuggestions.items.map((it, idx) => (
            <div
              className={
                "w-full text-gray-400/60 py-2 px-4 border border-gray-500/30 rounded text-sm text-center hover:cursor-pointer hover:bg-black/10 " +
                (selectedSuggestionIds.includes(idx)
                  ? "border-mainAccent/70 !text-mainAccent"
                  : "")
              }
              onClick={() => {
                if (selectedSuggestionIds.includes(idx)) {
                  dispatchStore(
                    suggestionGotUnselected({
                      imageName: thisImageName,
                      idx: idx,
                    })
                  );
                } else {
                  dispatchStore(
                    suggestionGotSelected({
                      imageName: thisImageName,
                      idx: idx,
                    })
                  );
                }
              }}
            >
              <p>{it}</p>
            </div>
          ))}
        </div>
        {provisionalSuggestions.loadStatus === 1 ? (
          <p className="text-gray-400/50">
            <small>Loading...</small>
          </p>
        ) : null}
      </div>
    </div>
  );
}
