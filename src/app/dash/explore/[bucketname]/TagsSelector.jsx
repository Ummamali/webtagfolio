import React from "react";

export default function TagsSelector({
  allTags,
  selectedIndices,
  setSelectedIndices,
}) {
  return (
    <div>
      <p className="text-gray-400 mb-2">Primary Tags</p>
      <div className="flex flex-wrap space-x-2">
        {allTags.map((t, i) =>
          selectedIndices.includes(i) ? (
            <button
              className="border border-purple-500 rounded-sm py-1 px-6 text-purple-500 text-sm hover:border-gray-500 hover:text-gray-500 my-1"
              onClick={() =>
                setSelectedIndices((prev) => prev.filter((item) => item !== i))
              }
            >
              {t}
            </button>
          ) : null
        )}
      </div>
      <div className="flex flex-wrap space-x-2">
        {allTags.map((t, i) =>
          !selectedIndices.includes(i) ? (
            <button
              className="border border-gray-500/70 rounded-sm py-1 px-6 text-gray-400 text-sm hover:border-purple-500 hover:text-purple-500 my-1"
              onClick={() => setSelectedIndices((prev) => [...prev, i])}
            >
              {t}
            </button>
          ) : null
        )}
      </div>
    </div>
  );
}
