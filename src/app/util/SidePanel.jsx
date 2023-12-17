"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

// following are the links to be shown in the panel
const links = [
  { text: "Dashboard", href: "/dashboard", icon: "home" },
  { text: "My Chats", href: "/chats", icon: "chat" },
  { text: "Text Detections", href: "/detect/text", icon: "text_fields" },
];

export default function SidePanel() {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <div className="bg-lightDark px-4 py-3">
      <div className="text-gray-400 space-y-3 mb-4">
        {links.map((l) => (
          <Link
            href={l.href}
            key={l.href}
            className={
              "flex items-center px-8 py-3 hover:bg-mainDark rounded-md " +
              (pathname === l.href
                ? "bg-mainDark border border-gray-500/50"
                : "")
            }
          >
            <span className="material-symbols-outlined mr-1">{l.icon}</span>{" "}
            {l.text}
          </Link>
        ))}
      </div>
      <div className="flex items-center space-x-3 pt-4 border-t border-gray-500/30">
        <Link
          href="/further/media"
          className="btn-mainAccent flex items-center"
        >
          <span className="material-symbols-outlined mr-1">add</span>
          Media
        </Link>
        <Link
          href="/further/bucket"
          className="btn-mainAccent flex items-center"
        >
          <span className="material-symbols-outlined mr-1">add</span>
          Bucket
        </Link>
      </div>
    </div>
  );
}
