import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import {
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
    <div>
      <h4 className="text-gray-400/90 mb-4">Suggestions for selection</h4>
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
        <div className="space-y-2">
          {provisionalSuggestions.items.map((it, idx) => (
            <div
              className={
                "w-full text-gray-400/60 py-2.5 px-4 border border-gray-500/30 rounded hover:cursor-pointer hover:bg-black/10 " +
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
