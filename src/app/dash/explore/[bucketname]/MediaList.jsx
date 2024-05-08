import Image from "next/image";
import React, { useState } from "react";
import { taggingEngine } from "../../../../../backend";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";

export default function MediaList({ allTags, selectedIndices, thisBucket }) {
  const [items, setItems] = useState(thisBucket.items);
  const userState = useSelector((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div>
      <div className="px-4 py-4 mt-4">
        <p className="text-gray-400">Name</p>
      </div>
      <div className="divide-y divide-gray-500/40 border-y border-gray-500/40">
        {items.map((it) => (
          <div
            className="py-4 px-4 hover:cursor-pointer hover:bg-gray-700/20 flex items-center justify-between"
            key={it.title}
            onClick={() =>
              router.push(
                pathname +
                  `?detailModel=${it.title}?bucketname=${thisBucket.name}`
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
              <a
                className="text-gray-400 hover:text-mainAccent"
                href={`${taggingEngine.urls.getImage}/${userState.userId}/${thisBucket.name}/${it.title}`}
                download={`${taggingEngine.urls.getImage}/${userState.userId}/${thisBucket.name}/${it.title}`}
                target="_blank"
              >
                {it.title}
              </a>
            </div>
            <div className="text-gray-400/70 text-sm text-right">
              <p>Objects: {it.tags.objects.length}</p>
              <p>People: {it.tags.people.length}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
