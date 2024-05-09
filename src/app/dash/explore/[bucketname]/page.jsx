"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TagsSelector from "./TagsSelector";
import MediaList from "./MediaList";
import { useSearchParams } from "next/navigation";
import MediaDetailModel from "./MediaDetailModel";
import DropdownMenu from "../../../util/Dropdown";

const mediaOptions = ["Organized", "Disorganized"];

export default function BucketExplorer({ params }) {
  const [mediaOp, setMediaOp] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const bucketState = useSelector((state) => state.buckets);
  const searchParams = useSearchParams();
  const thisBucket =
    bucketState.dataItems[bucketState.indicesMap[params.bucketname]];
  const thisBItems = thisBucket.items;
  const thisBDisordered = thisBucket.disorderedBucket;
  const precentage = parseInt(
    (thisBItems.length /
      (thisBDisordered.length + thisBItems.length !== 0
        ? thisBDisordered.length + thisBItems.length
        : 1)) *
      100
  );

  useEffect(() => {
    const selectedTagnames = selectedTags.map(
      (tgIdx) => thisBucket.summary[tgIdx]
    );
    const newFilterList = new Set();
    for (const mediaItem of thisBItems) {
      let containsTag = false;
      for (const tag of selectedTagnames) {
        const mediaItemTags = [
          ...mediaItem.tags.objects,
          ...mediaItem.tags.people,
        ];
        if (mediaItemTags.includes(tag)) {
          containsTag = true;
          break;
        }
      }
      if (!containsTag) {
        newFilterList.add(mediaItem.title);
      }
    }
    if (selectedTagnames.length > 0) {
      setFilteredItems(Array.from(newFilterList));
    } else {
      setFilteredItems([]);
    }
  }, [selectedTags]);

  return (
    <div>
      {searchParams.get("detailModel") ? <MediaDetailModel /> : null}
      <div className="flex items-start justify-between mb-4 pb-4">
        <div>
          <div className="text-yellow-600/80 -ml-0.5">
            {Array.from("x".repeat(thisBucket.stars)).map((s) => (
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }}
              >
                star
              </span>
            ))}
          </div>
          <div className="flex items-center mb-2">
            <span
              className="material-symbols-outlined text-gray-400 leading-none"
              style={{ fontSize: "30px" }}
            >
              folder_open
            </span>
            <h2 className="text-gray-400 text-3xl font-light ml-2">
              {params.bucketname}
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-1">{precentage}% organized</p>
          <div className="w-[300px] h-1.5 bg-gray-700/70 rounded-full">
            <div
              className="bg-green-600 rounded-full h-full"
              style={{ width: `${precentage}%` }}
            ></div>
          </div>
          <div className="mt-4 flex items-center space-x-3">
            <Link
              href={`/dash/upload/image?bucket=${thisBucket.name}`}
              className="btn border border-mainAccent text-mainAccent text-sm"
            >
              Add Image
            </Link>
            <Link
              href={`/dash/chat?bucket=${thisBucket.name}`}
              className="btn border border-mainAccent text-mainAccent text-sm"
            >
              Find Media
            </Link>
          </div>
        </div>
        <div className="text-right leading-tight text-sm text-gray-500">
          <DropdownMenu
            options={mediaOptions}
            currentOption={mediaOp}
            setCurrentOption={setMediaOp}
            className="mb-4"
          />
          <p>Organized: {thisBItems.length}</p>
          <p>Disorganized: {thisBDisordered.length}</p>
          <p className="border-t border-gray-500/80 pt-1 mt-1">
            Total: {thisBItems.length + thisBDisordered.length}
          </p>
        </div>
      </div>
      {parseInt(mediaOp) === 0 ? (
        <TagsSelector
          allTags={thisBucket.summary}
          selectedIndices={selectedTags}
          setSelectedIndices={setSelectedTags}
        />
      ) : null}
      <MediaList
        mediaOp={parseInt(mediaOp)}
        thisBucket={thisBucket}
        filteredItems={filteredItems}
      />
    </div>
  );
}
