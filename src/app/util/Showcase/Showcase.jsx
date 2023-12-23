"use client";
import Image from "next/image";
import React, { useState } from "react";
import CaseItem from "./CaseItem";

const caseItems = [
  { bucketTitle: "Skies", imgSrc: "/skies.jpg" },
  { bucketTitle: "Dilwale", imgSrc: "/dilwale.jpg" },
  { bucketTitle: "London", imgSrc: "/london.jpg" },
];

export default function Showcase() {
  const [current, setCurrent] = useState(1);
  return (
    <div>
      <div className="mb-4">
        <CaseItem data={caseItems[current]} />
      </div>
      <div className="flex items-center justify-center space-x-2">
        {caseItems.map((item, i) => (
          <button
            onClick={(e) => setCurrent(i)}
            className={
              "w-7 h-1.5 rounded-full bg-gray-600/80 hover:bg-gray-500 transition-all " +
              (i === current ? "!w-12 !bg-gray-500" : "")
            }
          ></button>
        ))}
      </div>
    </div>
  );
}
