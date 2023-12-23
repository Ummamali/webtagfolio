"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import SearchBar from "./SearchBar";
import UserBox from "./UsersBox";
import PanelOpened from "./PanelOpened";
import PanelClosed from "./PanelClosed";
import { useSelector } from "react-redux";

// CONFIG >>> following are the links to be shown in the panel
export const links = [
  { text: "Dashboard", href: "/dashboard", icon: "home" },
  { text: "My Chats", href: "/chats", icon: "chat" },
  { text: "Text Detections", href: "/detect/text", icon: "text_fields" },
];

export default function SidePanel() {
  const panelOpened = useSelector((state) => state.app.panelOpened);
  return panelOpened ? <PanelOpened /> : <PanelClosed />;
}
