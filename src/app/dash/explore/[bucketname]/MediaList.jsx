import Image from "next/image";
import React, { useEffect, useState } from "react";
import { taggingEngine } from "../../../../../backend";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import OrganizedMediaListItem from "./OrganizedMediaListItem";
import DisorganizedMediaListItem from "./DisorganizedMediaListItem";

export default function MediaList({ mediaOp, thisBucket, filteredItems }) {
  const userState = useSelector((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div>
      <div className="px-4 py-4 mt-4">
        <p className="text-gray-400">Name</p>
      </div>
      <div className="divide-y divide-gray-500/40 border-y border-gray-500/40">
        {mediaOp === 0
          ? thisBucket.items
              .filter((itm) => !filteredItems.includes(itm.title))
              .map((it) => (
                <OrganizedMediaListItem
                  it={it}
                  thisBucket={thisBucket}
                  pathname={pathname}
                  router={router}
                  userState={userState}
                />
              ))
          : null}
        {mediaOp === 1
          ? thisBucket.disorderedBucket.map((it) => (
              <DisorganizedMediaListItem
                it={it}
                thisBucket={thisBucket}
                userState={userState}
              />
            ))
          : null}
      </div>
    </div>
  );
}
