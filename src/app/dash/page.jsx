"use client";
import React, { useEffect } from "react";
import { simpleBackend, taggingEngine } from "../../../backend";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import CreateBucketMOdel from "./CreateBucketMOdel";
import { loadBucketsThunk } from "../../store/BucketsSlice";

export default function page() {
  const token = useSelector((state) => state.user.token);
  const bucketState = useSelector((state) => state.buckets);
  const searchParams = useSearchParams();
  const dispatchStore = useDispatch();

  useEffect(() => {
    dispatchStore(loadBucketsThunk({ token: token }));
  }, []);

  if (bucketState.loadStatus === 1 || bucketState.loadStatus === 0) {
    return <p>Loading</p>;
  }
  if (bucketState.loadStatus === 3) {
    return <p>Error</p>;
  }

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
          async function func() {
            const res = await fetch(simpleBackend.urls.allBuckets, {
              method: "POST",
              headers: {
                // "Content-Type": "application/json",
                Authorization: token,
              },
            });
            const resObj = await res.json();
            console.log(resObj);
          }

          func();
        }}
      >
        Run it
      </button>
    </div>
  );
}
