"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import DeleteOrgModel from "./DeleteOrgModel";
import { useSelector } from "react-redux";

export default function OrganizationList() {
  const searchParams = useSearchParams();
  // dummy data for now
  const orgData = useSelector((state) => state.org.data);
  const ownedOrgs = orgData.owned;
  const joinedOrgs = orgData.joined;

  return (
    <div className="mt-7 space-y-8 w-full">
      {searchParams.get("deleteOrgModel") === "true" ? (
        <DeleteOrgModel />
      ) : null}
      <div className="max-w-lg">
        <h3 className="text-white/70 text-lg">
          Your Owned Organizations ({ownedOrgs.length})
        </h3>
        <ul className="divide-y divide-gray-400/40">
          {ownedOrgs.length === 0 ? (
            <p className="text-gray-500 italic">
              <small>No organizations to show</small>
            </p>
          ) : (
            ownedOrgs.map((o) => (
              <li className="flex items-center py-3 text-sm">
                <p className="text-white/60 mr-auto">{o.name}</p>
                {o.code ? (
                  <p className="text-white/60">
                    <small>{`Join Code: ${o.code}`}</small>
                  </p>
                ) : (
                  <button className="span text-green-500">
                    <small>Request Code</small>
                  </button>
                )}
                <Link
                  className="text-red-500/80 text-sm ml-3"
                  href={{
                    pathname: "",
                    query: { deleteOrgModel: "true", orgId: o["_id"] },
                  }}
                >
                  delete
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="max-w-lg">
        <h3 className=" text-white/70 text-lg">
          Your Joined Organizations ({joinedOrgs.length})
        </h3>
        <ul className="divide-y divide-gray-400/40">
          {joinedOrgs.length === 0 ? (
            <p className="text-gray-500 italic">
              <small>No organizations to show</small>
            </p>
          ) : (
            joinedOrgs.map((o) => (
              <li className="flex items-center justify-between py-3 text-sm">
                <p className="text-white/60">{o.name}</p>
                <button className="span text-red-500/80">
                  <small>Leave</small>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
