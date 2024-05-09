import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { taggingEngine } from "../../../../../backend";
import Image from "next/image";

export default function DisorganizedMediaListItem({
  it,
  thisBucket,
  userState,
}) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div
      className="py-4 px-4 hover:cursor-pointer hover:bg-gray-700/20 flex items-center justify-between"
      key={it.title}
      onClick={() =>
        router.push(
          pathname +
            `?detailModel=${it.title}&bucketname=${thisBucket.name}&disorganized=true`
        )
      }
    >
      <div className="flex items-center space-x-6">
        <Image
          width={30}
          height={30}
          style={{ objectFit: "cover", width: 30, height: 30 }}
          src={`${taggingEngine.urls.getImage}/${userState.userId}/${thisBucket.name}/_disordered/${it.title}`}
          className="rounded-sm"
        />
        <p className="text-gray-400 ">{it.title}</p>
      </div>
      <div className="text-gray-400/70 text-sm text-right">
        <p>Disorganized</p>
      </div>
    </div>
  );
}
