import Image from "next/image";
import React from "react";
import { links } from "./SidePanel";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { panelOpened } from "../../../store/ApplicationSlice";

export default function SidePanelClosed({ openPanel }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  return (
    <div className="font-light backdrop-blur-xl backdrop-brightness-60 h-full py-7 px-4 flex flex-col items-center">
      <button
        className="flex items-center justify-center p-2 bg-gray-900 rounded-lg shadow-lg text-gray-200/60 hover:text-white"
        onClick={() => dispatch(panelOpened())}
      >
        <span className="material-symbols-outlined ">menu</span>
      </button>
      <div className="flex-1 space-y-2 mt-10">
        {links.map((lnk) => (
          <Link
            href={lnk.href}
            className={
              "flex items-center justify-center p-2 rounded-lg hover:bg-gray-200/20 " +
              (pathname === lnk.href ? "bg-gray-200/20" : "")
            }
          >
            <span className="material-symbols-outlined text-gray-200/80">
              {lnk.icon}
            </span>
          </Link>
        ))}
      </div>
      <Image
        src={"/jane.jpg"}
        height={50}
        width={50}
        className="rounded-full shadow-sm"
      />
    </div>
  );
}
