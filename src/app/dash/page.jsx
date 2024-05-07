"use client";
import React, { useEffect } from "react";
import { simpleBackend, taggingEngine } from "../../../backend";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import CreateBucketMOdel from "./CreateBucketMOdel";
import { createBucketThunk, loadBucketsThunk } from "../../store/BucketsSlice";
import Showcase from "./DashboardItems/Showcase";
import { userDataLoaded, userDataLoadedThunk } from "../../store/UserSlice";

export default function page() {
  const token = useSelector((state) => state.user.token);
  const bucketState = useSelector((state) => state.buckets);
  const searchParams = useSearchParams();
  const dispatchStore = useDispatch();

  return (
    <div>
      {/* necessary occasional models */}
      {searchParams.get("createBucket") === "true" ? (
        <CreateBucketMOdel />
      ) : null}

      <h2 className="text-gray-500 text-3xl font-light mt-4">
        Popular Buckets
      </h2>

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
    </div>
  );
}
