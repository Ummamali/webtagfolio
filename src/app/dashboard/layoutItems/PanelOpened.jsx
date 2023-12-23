import React from "react";
import SearchBar from "./SearchBar";
import UsersBox from "./UsersBox";
import { links } from "./SidePanel";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Logo from "/public/logo/white.png";

export default function PanelOpened({ closePanel }) {
  const pathname = usePathname();
  return (
    <div
      className="font-light backdrop-blur-xl backdrop-brightness-60 h-full py-7 px-4"
      style={{
        display: "grid",
        gridTemplateRows: "auto auto 1fr auto",
        gap: "1rem",
      }}
    >
      <div className="flex items-center justify-between mb-8">
        <Image src={Logo} width={120} className="opacity-80" />
        <button
          className="p-0.5 rounded-md bg-gray-900 text-gray-300/70 hover:text-white flex items-center justify-center"
          onClick={closePanel}
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
      </div>
      <SearchBar />
      <div className="text-gray-300 text-sm space-y-2 mt-8 px-4">
        {links.map((l) => (
          <Link
            href={l.href}
            key={l.href}
            className={
              "flex items-center px-4 py-1.5 rounded-3xl hover:bg-gray-200/10 " +
              (pathname === l.href ? " bg-gray-200/10" : "")
            }
          >
            <span className="material-symbols-outlined mr-4 !text-xl">
              {l.icon}
            </span>
            {l.text}
          </Link>
        ))}
      </div>
      <UsersBox />
    </div>
  );
}
