"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

// CONFIG >>> following are the links to be shown in the panel
const links = [
  { text: "Dashboard", href: "/dash", icon: "home" },
  { text: "My Buckets", href: "/dash/explore", icon: "folder_open" },
  { text: "My Chats", href: "/chats", icon: "chat" },
  { text: "Text Detections", href: "/dash/text", icon: "text_fields" },
  { text: "Enhancement", href: "/dash/media", icon: "brush" },
  { text: "My Videos", href: "/dash/videos", icon: "movie" },
];

export default function SidePanel() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div
      className="bg-lightDark px-5 py-6 shadow rounded"
      style={{ display: "grid", gridTemplateRows: "1fr auto" }}
    >
      <div className="text-gray-400/80 space-y-3 mb-4">
        {links.map((l) => (
          <Link
            href={l.href}
            key={l.href}
            className={
              "flex items-center text-sm px-4 py-2 border-l-2 border-transparent hover:border-gray-600 " +
              (pathname === l.href
                ? "!border-gray-600 text-gray-400 bg-gray-600/10"
                : "")
            }
          >
            <span className="material-symbols-outlined mr-4 !text-xl">
              {l.icon}
            </span>
            {l.text}
          </Link>
        ))}
      </div>
      <div className="flex items-center space-x-3 pt-4 border-t border-gray-500/30">
        <Link
          href="/dash/upload/image"
          className="btn-mainAccent flex items-center"
        >
          <span className="material-symbols-outlined mr-1">add</span>
          Image
        </Link>
        <button
          onClick={() => router.push(`${pathname}?createBucket=true`)}
          className="btn-mainAccent flex items-center"
        >
          <span className="material-symbols-outlined mr-1">add</span>
          Bucket
        </button>
      </div>
    </div>
  );
}
