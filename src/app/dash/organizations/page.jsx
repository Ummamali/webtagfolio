"use client";
import React from "react";
import OrganizationList from "./OrganizationList";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CreateOrgModel from "./CreateOrgModel";
import DeleteOrgModel from "./DeleteOrgModel";

export default function Organizations() {
  const searchParams = useSearchParams();
  return (
    <div>
      {searchParams.get("createModel") === "true" ? <CreateOrgModel /> : null}

      <div>
        <h2 className="text-3xl text-white/70 mb-2">
          Manage Your Organizations
        </h2>
        <small className="block mb-4 max-w-xl text-white/50">
          Effectively manage your organization by establishing clear
          communication channels and fostering a collaborative environment where
          members can actively contribute and coordinate tasks
        </small>

        <Link
          href={{
            pathname: "/dash/organizations",
            query: { createModel: "true" },
          }}
          className="btn-mainAccent"
        >
          <small>Create Oragnization</small>
        </Link>
      </div>
      <OrganizationList />
    </div>
  );
}
