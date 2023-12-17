"use client";
import React, { useState } from "react";

export default function SearchBar() {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className={
        "w-[420px] flex items-stretch p-2 pl-4 bg-lightDark rounded-full border border-lightDark " +
        (focused ? "!border-mainAccent/60" : "")
      }
    >
      <input
        type="text"
        className="h-8 flex-1 !bg-transparent border-none"
        onFocus={(e) => setFocused(true)}
        onBlur={(e) => setFocused(false)}
      />
      <button className="w-8 h-8 flex items-center justify-center bg-mainAccent rounded-full">
        <span className="material-symbols-outlined">search</span>
      </button>
    </div>
  );
}
