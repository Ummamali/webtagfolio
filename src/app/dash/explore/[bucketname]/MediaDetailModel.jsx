import React from "react";
import Model from "../../../util/Model";
import { useRouter } from "next/navigation";

export default function MediaDetailModel() {
  const router = useRouter();
  return (
    <Model close={() => router.back()}>
      <main className="max-w-[1000px] h-[90vh] bg-lightDark mx-auto mt-4 rounded shadow-md">
        <div>
          <h2>{}</h2>
        </div>
      </main>
    </Model>
  );
}
