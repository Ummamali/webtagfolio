import React, { useEffect, useState } from "react";
import Model from "../../../util/Model";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useSelector } from "react-redux";
import MediaDetailTags from "./MediaDetailTags";
import {
  getImageData,
  formatFileSize,
  downloadImage,
  downloadTags,
} from "../../../../utilFuncs/utilFuncs";
import { taggingEngine } from "../../../../../backend";

export default function MediaDetailModel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mediaItem, setMediaItem] = useState(null);
  const bucketState = useSelector((state) => state.buckets);
  const userState = useSelector((state) => state.user);
  useEffect(() => {
    const thisBucketItems =
      bucketState.dataItems[
        bucketState.indicesMap[searchParams.get("bucketname")]
      ].items;

    for (const [idx, item] of thisBucketItems.entries()) {
      if (item.title === searchParams.get("detailModel")) {
        const newItem = JSON.parse(JSON.stringify(item));
        newItem.url = `${taggingEngine.urls.getImage}/${
          userState.userId
        }/${searchParams.get("bucketname")}/${newItem.title}`;
        getImageData(newItem.url).then((data) => {
          setMediaItem({ ...newItem, ...data, index: idx });
        });
      }
    }
  }, []);

  return (
    <Model close={() => router.back()}>
      <main className="max-w-[1200px] h-[95vh] myScrollbar bg-lightDark mx-auto mt-4 py-8 px-12 rounded shadow-md overflow-y-auto">
        {mediaItem !== null ? (
          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400/80">
                  <span className="text-yellow-500/90">
                    {searchParams.get("bucketname")}
                  </span>
                  {mediaItem.path}
                  {mediaItem.title}
                </p>
                <div className="flex items-center space-x-2 text-2xl font-light">
                  <span className="material-symbols-outlined text-gray-400 leading-none">
                    image
                  </span>
                  <p className="text-gray-300/80">{mediaItem.title}</p>
                </div>
                <div className="flex mt-3 items-center space-x-4">
                  <button
                    className="btn btn-mainAccent text-sm px-12 py-2"
                    onClick={() =>
                      downloadImage(mediaItem.url, mediaItem.title)
                    }
                  >
                    Download
                  </button>
                  <button
                    className="text-mainAccent brightness-125"
                    onClick={() => downloadTags(mediaItem.tags)}
                  >
                    Download Tags
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-400/80 text-right border-r border-gray-600 pr-2">
                <p>Modified {mediaItem.lastModified}</p>
                <p>{mediaItem.fileType}</p>
                <p>
                  {mediaItem.width} x {mediaItem.height}
                </p>
                <p>{formatFileSize(mediaItem.size)}</p>
              </div>
            </div>
            <div className="relative h-[500px] w-full mt-6 mb-8">
              <Image
                src={mediaItem.url}
                fill={true}
                style={{ objectFit: "contain" }}
              />
            </div>
            <MediaDetailTags
              mediaItem={mediaItem}
              bucketname={searchParams.get("bucketname")}
              setMediaItem={setMediaItem}
            />
          </div>
        ) : (
          <p className="text-gray-400 animate-pulse-fast text-center">
            Loading...
          </p>
        )}
      </main>
    </Model>
  );
}
