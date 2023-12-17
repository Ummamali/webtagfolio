import Image from "next/image";
import React from "react";
import SearchBar from "./SearchBar";

export default function TopHeader() {
  return (
    <header className="flex items-center justify-between">
      <Image src="/logo.png" width={40} height={40} />
      <SearchBar />
    </header>
  );
}
