import Image from "next/image";
import React from "react";
import SearchBar from "./TopHeaderChildren/SearchBar";
import NotificationBtn from "./TopHeaderChildren/NotificationsBtn";

export default function TopHeader() {
  return (
    <header className="flex items-center justify-between pb-4 border-b border-lightDark mb-4">
      <Image src="/logo.png" width={36} height={36} />
      <SearchBar />
      <div className="flex items-center space-x-2">
        <button className="btn-mainAccent px-10">Chat</button>
        <NotificationBtn />
      </div>
    </header>
  );
}
