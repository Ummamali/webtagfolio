import React from "react";

export default function OverallSuggestions({ thisImage }) {
  return (
    <div>
      <h3 className="text-gray-400/80 mb-3">Suggested People</h3>
      <div className="space-y-2">
        {thisImage.overallSuggestions.suggestions.people.list.map((item) => (
          <div className="w-full text-gray-400/60 py-2.5 px-4 border border-gray-500/30 rounded hover:cursor-pointer hover:bg-black/10">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
