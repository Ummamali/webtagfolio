"use client";
import React, { useState } from "react";

// we are giving a fixed height to the input and btn to make it a box
const barInnerHeightCls = "h-7";

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
        className={"flex-1 !bg-transparent border-none " + barInnerHeightCls}
        placeholder="Search anything...."
        onFocus={(e) => setFocused(true)}
        onBlur={(e) => setFocused(false)}
      />
      <button
        className={
          "w-7 flex items-center justify-center bg-mainAccent rounded-full " +
          barInnerHeightCls
        }
      >
        <span className="material-symbols-outlined">search</span>
      </button>
    </div>
  );
}
