import Image from "next/image";
import React from "react";
import { taggingEngine } from "../../../../../backend";
import { downloadImage, truncateText } from "../../../../utilFuncs/utilFuncs";

export default function ReplyMsgBox({
  bucketName,
  text,
  mediaIdcs,
  thisBucketItems,
  userId,
}) {
  return (
    <div className="mt-3">
      <p className="bg-gray-400/20 text-white/70 px-3 py-2 rounded mr-2 inline-block mb-3 text-sm">
        {text}
      </p>
      <div className="max-w-[600px] overflow-x-auto myScrollbar flex">
        {mediaIdcs.map((idx) => (
          <div>
            <div
              className="relative w-28 h-28 bg-blue-900 mr-3 hover:cursor-pointer shadow"
              onClick={() => {
                downloadImage(
                  `${taggingEngine.urls.getImage}/${userId}/${bucketName}/${thisBucketItems[idx].title}`,
                  thisBucketItems[idx].title
                );
              }}
            >
              <Image
                fill={true}
                className="rounded"
                style={{ objectFit: "cover" }}
                src={`${taggingEngine.urls.getImage}/${userId}/${bucketName}/${thisBucketItems[idx].title}`}
              />
            </div>
            <p className="text-sm text-gray-400/60 pt-1 mb-1">
              {truncateText(thisBucketItems[idx].title, 15)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
