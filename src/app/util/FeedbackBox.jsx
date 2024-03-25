import React from "react";

const typeClasses = {
  ERROR: "bg-red-800 text-white/80",
  INFO: "bg-red-800 text-white/80",
  SUCCESS: "bg-red-800 text-white/80",
};

export default function FeedbackBox({ type = "INFO", msg, addCls = "" }) {
  return (
    <p
      className={
        "py-2 px-8 rounded-sm text-sm text-center mb-4 shadow-sm " +
        typeClasses[type] +
        " " +
        addCls
      }
    >
      {msg}
    </p>
  );
}
