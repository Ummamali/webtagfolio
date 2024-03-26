import React from "react";
import OrganizationList from "./OrganizationList";
import Link from "next/link";

export default function Organizations() {
  return (
    <div>
      <div>
        <h2 className="text-3xl text-white/70 mb-2">
          Manage Your Organizations
        </h2>
        <small className="block mb-4 max-w-xl text-white/50">
          Effectively manage your organization by establishing clear
          communication channels and fostering a collaborative environment where
          members can actively contribute and coordinate tasks
        </small>

        <Link href={"/dash/organizations/create"} className="btn-mainAccent">
          <small>Create Oragnization</small>
        </Link>
      </div>
      <OrganizationList />
    </div>
  );
}
