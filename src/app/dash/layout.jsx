"use client";
import { useEffect, useRef, useState } from "react";
import SidePanel from "./layoutItems/SidePanel";
import TopHeader from "./layoutItems/TopHeader";
import UsersBox from "./layoutItems/UsersBox";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { userDataLoadedThunk, userIdentified } from "../../store/UserSlice";
import FlashMessage from "../util/FlashMessage";
import { useSearchParams } from "next/navigation";

import { simpleBackend } from "../../../backend";
import CreateBucketModel from "./CreateBucketMOdel";
import Image from "next/image";
import { loadBucketsThunk } from "../../store/BucketsSlice";

export default function DashboardLayout({
  children, // will be a page or nested layout
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const bucketState = useSelector((state) => state.buckets);
  const searchParams = useSearchParams();
  const firstRun = useRef(true);
  useEffect(() => {
    async function identifyUser() {
      const token = localStorage.getItem("Authorization");
      const userId = localStorage.getItem("userId");
      const email = localStorage.getItem("userEmail");
      const username = localStorage.getItem("username");
      if (!token || !userId) {
        router.push("/login");
        return null;
      }
      const res = await fetch(simpleBackend.urls.verifyToken, {
        method: "POST",
        headers: {
          Authorization: token,
        },
      });
      if (res.ok) {
        dispatch(userIdentified({ token, userId, email, username }));
      } else {
        router.push("/login");
      }
    }
    identifyUser().catch((err) => router.push("/login"));
  }, []);

  useEffect(() => {
    if (userState.token !== null && firstRun.current) {
      firstRun.current = false;
      dispatch(loadBucketsThunk({ Authorization: userState.token }));
      dispatch(userDataLoadedThunk(userState.token));
    }
  }, [userState.token]);

  // Not rendering anything as long as user is properly identified, cover will become false upon identification
  if (
    userState.token === null ||
    bucketState.loadStatus !== 2 ||
    !userState.userDataIsLoaded
  ) {
    return (
      <div className="bg-mainDark w-screen h-screen flex items-center justify-center">
        <Image
          src={"/logo.png"}
          width={150}
          height={150}
          className="animate-pulse-fast"
        />
      </div>
    );
  }
  return (
    <div
      className="h-screen bg-mainDark py-4 px-6"
      style={{ display: "grid", gridTemplateRows: "auto 1fr" }}
    >
      {/* necessary occasional models */}
      {searchParams.get("createBucket") === "true" ? (
        <CreateBucketModel />
      ) : null}
      <TopHeader />
      <div style={{ display: "grid", gridTemplateColumns: "16rem auto" }}>
        <div
          style={{
            gridTemplateRows: "1fr auto",
            display: "grid",
            gap: "1.5rem",
          }}
        >
          <SidePanel />
          <UsersBox userData={userState} />
        </div>
        <div className="px-10">{children}</div>
      </div>
      <FlashMessage />
    </div>
  );
}
