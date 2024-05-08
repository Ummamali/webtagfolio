"use client";
import React, { useEffect } from "react";
import { simpleBackend, taggingEngine } from "../../../backend";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import CreateBucketMOdel from "./CreateBucketMOdel";
import bucketsSlice, {
  createBucketThunk,
  loadBucketsThunk,
} from "../../store/BucketsSlice";
import Showcase from "./DashboardItems/Showcase";
import AnalysisBarSection from "./DashboardItems/AnalysisBarSection";
import { userDataLoaded, userDataLoadedThunk } from "../../store/UserSlice";

export default function page() {
  const token = useSelector((state) => state.user.token);
  const bucketState = useSelector((state) => state.buckets);
  const userState = useSelector((state) => state.user);
  const searchParams = useSearchParams();
  const dispatchStore = useDispatch();

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-gray-400 text-3xl font-light mt-4">
            Popular Buckets
          </h2>
          <p className="text-sm text-gray-600">
            Your dashboard shows the featured buckets
          </p>
        </div>
        <div className="text-gray-500 text-sm text-right border-r border-gray-500/70 pr-2">
          <div className="flex items-center space-x-1">
            <p>
              Last Changes:{" "}
              <span className="font-medium">
                {userState.userData.lastUpdated
                  ? new Date(userState.userData.lastUpdated).toDateString()
                  : "N/A"}
              </span>
            </p>
          </div>
          <p>Buckets: {bucketState.dataItems.length}</p>
          <p>Featured: {userState.userData.featuredBuckets.length}</p>
        </div>
      </div>

      {bucketState.loadStatus === 2 ? (
        <Showcase />
      ) : (
        <div className="text-center mt-8">
          <p className="text-gray-400/70">
            <small>
              Your buckets are the containers to save your media items
            </small>
          </p>
          <button
            className="text-mainAccent disabled:text-gray-300"
            onClick={() => {
              dispatchStore(loadBucketsThunk({ Authorization: token }));
              dispatchStore(userDataLoadedThunk(token));
            }}
            disabled={bucketState.loadStatus === 1}
          >
            {bucketState.loadStatus === 1 ? "Loading..." : "Load Buckets"}
          </button>
        </div>
      )}

      <main>
        <div>
          <h2 className="text-gray-400 text-2xl font-light mt-4">
            Analysis Status
          </h2>
          <p className="text-sm text-gray-600">
            Dashboard shows how well organized your buckets are
          </p>
        </div>
        <div className="mt-2">
          {userState.userData.featuredBuckets.map((bkt) => (
            <AnalysisBarSection bucket={bkt} key={bkt.name} />
          ))}
        </div>
      </main>
    </div>
  );
}
