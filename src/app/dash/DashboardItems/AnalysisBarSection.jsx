import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

export default function AnalysisBarSection({ bucket }) {
  const bucketsState = useSelector((state) => state.buckets);
  const router = useRouter();
  const thisBucket =
    bucketsState.dataItems[bucketsState.indicesMap[bucket.name]];
  const percentage =
    (thisBucket.items.length /
      (thisBucket.disorderedBucket.length + thisBucket.items.length)) *
    100;
  return (
    <div
      className="rounded hover:bg-gray-600/20 hover:cursor-pointer p-3 py-4 "
      onClick={() => router.push(`/dash/explore/${thisBucket.name}`)}
    >
      <div className="flex items-end justify-between mb-1">
        <h4 className="text-gray-500 mb-1">{bucket.name}</h4>
        <p className="text-sm text-gray-500/90">{percentage}% organized</p>
      </div>
      <div className="flex items-stretch h-2.5 rounded-full bg-gray-700/80">
        <div
          className="bg-green-700 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
