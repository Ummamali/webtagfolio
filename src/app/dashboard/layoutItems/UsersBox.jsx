import Image from "next/image";
import Link from "next/link";
import React from "react";
import { contentServer } from "../../../../backend.js";

// CONFIG
const imageSize = { width: 60, height: 60 };

export default function UsersBox() {
  const userData = {
    userName: "Jane Hopper",
    mainOrganization: "Hawkins Post",
    profilePic: "/jane.jpg",
  };
  return (
    <div>
      <div className="flex items-center justify-center space-x-4 mt-4">
        <Image
          src={contentServer.urls.users + "shahrukh.jpg"}
          height={imageSize.height}
          width={imageSize.width}
          className="rounded-full"
        />
        <div className="leading-none">
          <h4 className="text-gray-300">{userData.userName}</h4>
          <small className="text-gray-300/70">
            {userData.mainOrganization}
          </small>
        </div>
      </div>
    </div>
  );
}
