import React from "react";

export default function Model({ children, close }) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <div
        className="absolute -z-10 w-full h-full bg-black/40 backdrop-blur-sm hover:cursor-pointer"
        onClick={close}
      ></div>
      {children}
    </div>
  );
}
