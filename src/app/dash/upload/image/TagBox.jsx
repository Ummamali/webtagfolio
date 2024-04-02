import React, { useState } from "react";

export default function TagBox({ text, idx, gotSelected }) {
  return (
    <button
      className="flex items-center text-gray-400 text-sm border border-gray-400 py-1 px-6 rounded-sm hover:border-purple-500 hover:text-purple-500 hover:cursor-pointer mt-2 mr-2 shadow-sm"
      onClick={(e) => {
        gotSelected(idx);
      }}
      data-idx={idx}
    >
      <p>{text}</p>
    </button>
  );
}
