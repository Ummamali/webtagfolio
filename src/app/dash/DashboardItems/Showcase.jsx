import React from "react";
import { useSelector } from "react-redux";
import { simpleBackend, taggingEngine } from "../../../../backend";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Showcase() {
  const user = useSelector((state) => state.user);
  const featuredBuckets = user.userData.featuredBuckets;
  const bucketsSlice = useSelector((state) => state.buckets);
  const router = useRouter();

  return (
    <div className="pt-4 max-w-[1200px] mx-auto">
      <div className="flex h-[280px] space-x-4">
        {featuredBuckets.map((bucket) => (
          // Showcase card below
          <div
            className="relative h-full flex-1 rounded shadow hover:cursor-pointer overflow-hidden"
            style={{
              background: `url(${taggingEngine.urls.getImage}/${user.userId}/${bucket.name}/${bucket.titleCover}) no-repeat center center/cover`,
            }}
          >
            <div
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-black/20 hover:bg-black/50"
              onClick={() => router.push(`/dash/explore/${bucket.name}`)}
            ></div>

            <div className="absolute bottom-0 w-full p-4">
              <div className="text-yellow-600 -mb-2 -ml-0.5">
                {Array.from(
                  "x".repeat(
                    bucketsSlice.dataItems[bucketsSlice.indicesMap[bucket.name]]
                      .stars
                  )
                ).map((s) => (
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "19px" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <h3 className="text-white/75 text-xl">{bucket.name}</h3>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/40 text-sm italic">
                    {bucketsSlice.dataItems[
                      bucketsSlice.indicesMap[bucket.name]
                    ].items.length +
                      bucketsSlice.dataItems[
                        bucketsSlice.indicesMap[bucket.name]
                      ].disorderedBucket.length}{" "}
                    items
                  </p>
                  <div className="text-white/50 flex space-x-2 text-sm">
                    {bucketsSlice.dataItems[
                      bucketsSlice.indicesMap[bucket.name]
                    ].summary
                      .slice(0, 8)
                      .map((s, idx, arr) => (
                        <button className="hover:text-white">
                          {s}{" "}
                          {idx === arr.length - 1 ? null : <span>&bull;</span>}
                        </button>
                      ))}
                  </div>
                </div>
                <button className="btn border border-mainAccent/50 text-mainAccent rounded-sm text-sm">
                  Find
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <p className="text-sm text-center text-gray-500 mt-3">
          <small>
            Can't find it here?{" "}
            <Link href={"/dash/explore"} className="text-mainAccent/80">
              All Buckets
            </Link>
          </small>
        </p>
      </div>
    </div>
  );
}
