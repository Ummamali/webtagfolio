"use client";
import React, { useState } from "react";

export default function OrganizationList() {
  // dummy data for now
  const [ownedOrgs, setOwnedOrgs] = useState([
    { _id: "1827319831", name: "Org 1", code: "166554" },
    { _id: "1827319831", name: "Org 1", code: "166554" },
    { _id: "1827319831", name: "Org 1", code: "166554" },
    { _id: "1827319831", name: "Org 1" },
  ]);
  // dummy data for now
  const [joinedOrgs, setJoinedOrgs] = useState([
    { _id: "1827319831", name: "Org 1", code: "166554" },
    { _id: "1827319831", name: "Org 1", code: "166554" },
    { _id: "1827319831", name: "Org 1", code: "166554" },
    { _id: "1827319831", name: "Org 1", code: "166554" },
  ]);

  return (
    <div className="mt-7 space-y-4 w-full">
      <div>
        <h3 className="block max-w-lg text-white/70 text-lg">
          Your Owned Organizations ({ownedOrgs.length})
        </h3>
        <ul className="divide-y divide-gray-400/40">
          {ownedOrgs.map((o) => (
            <li className="flex items-center justify-between py-3 text-sm">
              <p className="text-white/60">{o.name}</p>
              {o.code ? (
                <p className="text-white/60">
                  <small>{`Join Code: ${o.code}`}</small>
                </p>
              ) : (
                <button className="span text-green-500">
                  <small>Request Code</small>
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="block max-w-lg text-white/70 text-lg">
          Your Joined Organizations ({ownedOrgs.length})
        </h3>
        <ul className="divide-y divide-gray-400/40">
          {joinedOrgs.map((o) => (
            <li className="flex items-center justify-between py-3 text-sm">
              <p className="text-white/60">{o.name}</p>
              <button className="span text-red-500/80">
                <small>Leave</small>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
