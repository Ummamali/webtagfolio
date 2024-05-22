import React, { useRef } from "react";

export default function ChatBar({ setQuery }) {
  const inputRef = useRef();
  return (
    <form
      className="flex items-center"
      onSubmit={(e) => {
        e.preventDefault();
        setQuery({ text: inputRef.current.value, now: Date.now() });
        inputRef.current.value = "";
      }}
    >
      <input
        type="text"
        ref={inputRef}
        className="block py-2 px-4 border border-gray-400/60 flex-1 mr-2 !rounded-lg"
      />
      <button className="btn btn-mainAccent w-10 h-10 !rounded-full flex items-center justify-center">
        <span className="material-symbols-outlined leading-none text-2xl">
          send
        </span>
      </button>
    </form>
  );
}
