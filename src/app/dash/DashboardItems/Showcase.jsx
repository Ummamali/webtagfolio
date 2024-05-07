import React from "react";
import { useSelector } from "react-redux";
import { simpleBackend, taggingEngine } from "../../../../backend";

export default function Showcase() {
  const user = useSelector((state) => state.user);
  const featuredBuckets = user.userData.featuredBuckets;
  return (
    <div className="pt-4 max-w-[1000px]">
      <div className="flex h-[300px] space-x-4">
        {featuredBuckets.map((bucket) => (
          <div
            className=" relative h-full flex-1 rounded-sm shadow"
            style={{
              background: `url(${taggingEngine.urls.getImage}/${user.userId}/${bucket.name}/${bucket.titleCover}) no-repeat center center/cover`,
            }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute bottom-0 w-full px-2 pb-2 ">
              <h3 className="text-gray-400">{bucket.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
