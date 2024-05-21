import React from "react";

export default function BoxListViewer({ thisImageBoxes }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg text-gray-400">Boxes</h4>
        <p className="text-sm text-gray-400/80">({thisImageBoxes.length})</p>
      </div>
      <div className="h-[600px] border border-gray-500/20 shadow-lg rounded px-2 py-4 overflow-y-scroll myScrollbar space-y-4">
        {thisImageBoxes.map((item) => (
          <div className="bg-mainDark/70 px-3 py-4 text-gray-500 grid grid-cols-2 gap-2">
            {item.tags.map((t) => (
              <p className="border border-gray-500/50 text-center rounded-sm">
                {t}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
