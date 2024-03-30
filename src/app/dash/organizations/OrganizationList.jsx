"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import DeleteOrgModel from "./DeleteOrgModel";
import { useDispatch, useSelector } from "react-redux";
import { simpleBackend } from "../../../../backend";
import { orgActions } from "../../../store/OrgSlice";
import { flashedError, flashedSuccess } from "../../../store/ApplicationSlice";

export default function OrganizationList() {
  const searchParams = useSearchParams();
  const token = useSelector((state) => state.user.token);
  const orgData = useSelector((state) => state.org.data);
  const dispatchStore = useDispatch();
  const ownedOrgs = orgData.ownedOrganizations;
  const joinedOrgs = orgData.joinedOrganizations;

  function requestCode(name) {
    async function contactServer() {
      const res = await fetch(simpleBackend.urls.orgRequestCode, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ name: name }),
      });
      if (res.ok) {
        const resObj = await res.json();
        dispatchStore(
          orgActions.codeGenerated({
            name: name,
            joinCode: resObj.joinCode,
          })
        );
        dispatchStore(
          flashedSuccess("Organization join code successfully generated")
        );
      }
    }
    contactServer().catch((err) =>
      dispatchStore(flashedError("Failed to generated code"))
    );
  }

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
              <li className="flex items-center py-3 text-sm" key={o["_id"]}>
                <p className="text-white/60 mr-auto">{o.name}</p>
                {o.joinCode ? (
                  <p className="text-white/60 italic font-light">
                    <small>
                      Join Code:{" "}
                      <span className="font-normal">{o.joinCode}</span>
                    </small>
                  </p>
                ) : (
                  <button
                    className="span text-green-500"
                    onClick={() => requestCode(o.name)}
                  >
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
              <li
                className="flex items-center justify-between py-3 text-sm"
                key={o["_id"]}
              >
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
