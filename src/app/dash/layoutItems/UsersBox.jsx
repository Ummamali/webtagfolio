import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { taggingEngine } from "../../../../backend";

// CONFIG
const imageSize = { width: 50, height: 50 };

const controlButtons = [
  { icon: "settings", route: "/settings" },
  { icon: "manage_accounts", route: "/userSettings" },
  { icon: "groups", route: "/dash/organizations" },
];

export default function UsersBox({ userData }) {
  const profilePicPath = `${taggingEngine.urls.getImage}/${userData.userId}/_account/profile_pic.jpg`;
  return (
    <div className="bg-lightDark px-4 py-5 shadow rounded">
      <div className="flex items-center justify-center space-x-3 mb-4 pb-4 border-b border-gray-500/30">
        <Image
          src={profilePicPath}
          height={imageSize.height}
          width={imageSize.width}
          style={{ objectFit: "conver" }}
          className="rounded-full"
        />
        <div className="leading-none">
          <h4 className="text-gray-400">{userData.username}</h4>
          <p>
            <small className="text-gray-500">{userData.email}</small>
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-3">
        {controlButtons.map((btn) => (
          <Link
            href={btn.route}
            className="w-11 h-11 rounded-full bg-mainDark flex items-center justify-center text-mainAccent/70 text-lg hover:text-mainAccent "
          >
            <span class="material-symbols-outlined">{btn.icon}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
