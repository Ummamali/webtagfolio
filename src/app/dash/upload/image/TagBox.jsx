import React, { useState } from "react";

export default function TagBox({ text, idx, gotSelected }) {
  return (
    <button
      className="flex items-center text-purple-500 text-sm border border-purple-500 py-1 px-6 rounded-sm hover:border-green-500 hover:text-green-500 hover:cursor-pointer mt-2 mr-2 shadow-sm"
      onClick={(e) => gotSelected(idx)}
      data-idx={idx}
    >
      <p>{text}</p>
    </button>
  );
}
