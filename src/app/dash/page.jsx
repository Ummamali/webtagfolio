"use client";
import React, { useEffect } from "react";
import { simpleBackend, taggingEngine } from "../../../backend";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import CreateBucketMOdel from "./CreateBucketMOdel";
import { createBucketThunk, loadBucketsThunk } from "../../store/BucketsSlice";

export default function page() {
  const token = useSelector((state) => state.user.token);
  const bucketState = useSelector((state) => state.buckets);
  const searchParams = useSearchParams();
  const dispatchStore = useDispatch();

  // useEffect(() => {
  //   dispatchStore(loadBucketsThunk({ Authorization: token }));
  // }, []);

  // if (bucketState.loadStatus === 1 || bucketState.loadStatus === 0) {
  //   return <p>Loading</p>;
  // }
  // if (bucketState.loadStatus === 3) {
  //   return <p>Error</p>;
  // }

  return (
    <div>
      {/* necessary occasionale models */}
      {searchParams.get("createBucket") === "true" ? (
        <CreateBucketMOdel />
      ) : null}
      <h2 className="text-gray-500">Dashboard</h2>
      <button
        className="btn-mainAccent"
        onClick={() => {
          dispatchStore(loadBucketsThunk({ Authorization: token }));
        }}
      >
        Run it
      </button>

      <button
        className="btn-mainAccent"
        onClick={() => {
          dispatchStore(
            createBucketThunk({ name: "mynewbucket" }, { Authorization: token })
          );
        }}
      >
        Create It
      </button>
    </div>
  );
}
