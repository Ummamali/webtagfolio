import Image from "next/image";
import Link from "next/link";
import React from "react";

// CONFIG
const imageSize = { width: 50, height: 50 };

const controlButtons = [
  { icon: "settings", route: "/settings" },
  { icon: "manage_accounts", route: "/userSettings" },
  { icon: "groups", route: "/dash/organizations" },
];

export default function UsersBox() {
  const userData = {
    userName: "Jane Hopper",
    mainOrganization: "Hawkins Post",
    profilePic: "/jane.jpg",
  };
  return (
    <div className="bg-lightDark px-4 py-5 shadow rounded">
      <div className="flex items-center justify-center space-x-3 mb-4 pb-4 border-b border-gray-500/30">
        <Image
          src={userData.profilePic}
          height={imageSize.height}
          width={imageSize.width}
          className="rounded-full"
        />
        <div className="leading-none">
          <h4 className="text-gray-400">{userData.userName}</h4>
          <small className="text-gray-500/70">
            {userData.mainOrganization}
          </small>
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
