import Image from "next/image";
import React from "react";
import { taggingEngine } from "../../../../../backend";

export default function OrganizedMediaListItem({
  it,
  thisBucket,
  router,
  pathname,
  userState,
}) {
  return (
    <div
      className="py-4 px-4 hover:cursor-pointer hover:bg-gray-700/20 flex items-center justify-between"
      key={it.title}
      onClick={() =>
        router.push(
          pathname + `?detailModel=${it.title}&bucketname=${thisBucket.name}`
        )
      }
    >
      <div className="flex items-center space-x-6">
        <Image
          width={30}
          height={30}
          style={{ objectFit: "cover", width: 30, height: 30 }}
          src={`${taggingEngine.urls.getImage}/${userState.userId}/${thisBucket.name}/${it.title}`}
          className="rounded-sm"
        />
        <p className="text-gray-400">{it.title}</p>
      </div>
      <div className="text-gray-400/70 text-sm text-right">
        <p>Objects: {it.tags.objects.length}</p>
        <p>People: {it.tags.people.length}</p>
      </div>
    </div>
  );
}
