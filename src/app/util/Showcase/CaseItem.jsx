import Image from "next/image";
import React from "react";

// configs

const backgroundGradient = "linear-gradient(to top, black, transparent 90%)";

export default function CaseItem({ data }) {
  return (
    <div className="relative w-full h-64">
      <div className="relative w-full h-full">
        <Image src={data.imgSrc} objectFit="cover" fill={true} />
      </div>
      <div
        className="absolute w-full h-full top-0 left-0 p-4 flex flex-col items-start justify-end"
        style={{ background: backgroundGradient }}
      >
        <h3 className="text-white">{data.bucketTitle}</h3>
      </div>
    </div>
  );
}
