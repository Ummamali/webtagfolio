"use client";
import { useEffect, useState } from "react";
import SidePanel from "./layoutItems/SidePanel";
import TopHeader from "./layoutItems/TopHeader";
import UsersBox from "./layoutItems/UsersBox";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { userIdentified } from "../../store/UserSlice";

export default function DashboardLayout({
  children, // will be a page or nested layout
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [cover, setCover] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    const userId = localStorage.getItem("userId");
    if (!token) {
      router.push("/login");
    } else {
      dispatch(userIdentified({ token, userId }));
      setCover(false);
    }
  }, []);
  if (cover) {
    return null;
  }
  return (
    <div
      className="h-screen bg-mainDark py-4 px-6"
      style={{ display: "grid", gridTemplateRows: "auto 1fr" }}
    >
      <TopHeader />
      <div className="flex">
        <div
          className="w-64"
          style={{
            gridTemplateRows: "1fr auto",
            display: "grid",
            gap: "1.5rem",
          }}
        >
          <SidePanel />
          <UsersBox />
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
