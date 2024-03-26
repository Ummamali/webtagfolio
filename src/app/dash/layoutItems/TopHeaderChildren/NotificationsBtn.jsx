import React from "react";

export default function NotificationsBtn() {
  return (
    <div className="relative">
      <div className="w-3 h-3 bg-green-400 absolute top-0 right-0 rounded-full"></div>
      <button className="h-10 w-10 rounded-full bg-lightDark text-gray-500 flex items-center justify-center text-lg">
        <span className="material-symbols-outlined">notifications</span>
      </button>
    </div>
  );
}
