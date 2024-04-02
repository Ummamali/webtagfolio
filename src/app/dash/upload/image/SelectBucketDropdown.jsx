import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function SelectBucketDropdown() {
  const [opened, setOpened] = useState(false);
  const [selectedName, setSetselectedName] = useState(null);
  let buckets = useSelector((state) => state.buckets.data.list);
  buckets = buckets === undefined ? [] : buckets;
  const bucketNames = buckets.map((b) => b.name);
  return (
    <div className="relative w-min">
      <button
        className="btn py-2 px-4 border border-gray-500 text-gray-400 rounded-sm flex items-center justify-between w-[300px]"
        onClick={() => setOpened((prev) => !prev)}
      >
        <span>{selectedName === null ? "Select Bucket" : selectedName}</span>
        <span class="material-symbols-outlined leading-inherit ml-3">
          expand_more
        </span>
      </button>
      {opened ? (
        <div className="absolute bg-lightDark w-full bottom-0 left-0 translate-y-full py-2">
          {bucketNames.length === 0 ? (
            <p className="text-gray-500 px-2">
              <small>No Buckets to show</small>
            </p>
          ) : (
            bucketNames.map((bNme) => (
              <button
                className="text-gray-400 border border-transparent hover:border-gray-400 w-full py-1"
                onClick={() => {
                  setSetselectedName(bNme);
                  setOpened(false);
                }}
              >
                {bNme}
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
