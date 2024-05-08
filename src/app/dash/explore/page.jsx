"use client";
import React, { useEffect, useState } from "react";
import Dropdown from "../../util/Dropdown";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";

const bucketsOptions = ["all", "owned", "organization"];

export default function Explorer() {
  const [currentBucketCat, setCurrentBucketCat] = useState(0);
  const [shownBuckets, setShownBuckets] = useState([]);
  const bucketsState = useSelector((state) => state.buckets);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (currentBucketCat === 0) {
      setShownBuckets([...bucketsState.dataItems]);
    }
  }, [currentBucketCat]);
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-400 text-2xl font-light mt-4">
            Bucket Explorer
          </h2>
          <p className="text-sm text-gray-600">
            Explore and modify your media assets here
          </p>
        </div>
        <button
          className="btn border border-mainAccent/50 text-mainAccent/70"
          onClick={() => {
            router.push(pathname + "?createBucket=true");
          }}
        >
          Create Bucket
        </button>
      </div>
      <main className="mt-4">
        <div className="flex items-center">
          <Dropdown
            options={bucketsOptions}
            currentOption={currentBucketCat}
            setCurrentOption={setCurrentBucketCat}
          />
        </div>
        <div className="px-4 py-4 mt-4">
          <p className="text-gray-400">Name</p>
        </div>
        <div className="divide-y divide-gray-500/40 border-y border-gray-500/40">
          {shownBuckets.map((bkt) => (
            <div
              className="py-5 px-4 hover:cursor-pointer hover:bg-gray-700/30 flex items-center justify-between"
              onClick={() => {
                router.push(pathname + "/" + bkt.name);
              }}
            >
              <div className="flex items-center space-x-6">
                <span className="material-symbols-outlined text-gray-400 leading-none">
                  folder
                </span>

                <p className="text-gray-400">{bkt.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500/70">{bkt.stars} stars</p>

                <p className="text-sm text-gray-500/80">
                  {parseInt(
                    (bkt.items.length /
                      (bkt.items.length + bkt.disorderedBucket.length)) *
                      100
                  )}
                  % organized
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
