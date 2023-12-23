"use client";
import React, { useState } from "react";

// we are giving a fixed height to the input and btn to make it a box

export default function SearchBar() {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className={
        "flex items-center py-1.5 px-2 rounded-lg bg-white/20 hover:border-gray-300 shadow-sm border border-transparent " +
        (focused ? "!border-gray-300" : "")
      }
    >
      <span className="material-symbols-outlined mr-2 text-gray-200">
        search
      </span>
      <input
        type="text"
        className={
          "flex-1 !bg-transparent !p-0 border-none placeholder:!text-white/60 placeholder:font-light placeholder:text-sm !text-gray-300 "
        }
        placeholder="Search anything...."
        onFocus={(e) => setFocused(true)}
        onBlur={(e) => setFocused(false)}
      />
    </div>
  );
}
