import React from "react";
import Model from "../../util/Model";
import { useRouter, useSearchParams } from "next/navigation";

export default function DeleteOrgModel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function close() {
    router.back();
  }
  return (
    <Model close={close}>
      <main className="model-main">
        <h3 className="text-white/70">Delete Organization</h3>
        <p className="text-white/50">
          <small>Are you sure you want to delete organization?</small>
        </p>
        <div className="space-x-4 mt-4">
          <button className="btn bg-red-900 text-white/70 px-10">Yes</button>
          <button onClick={close} className="btn bg-mainAccent px-10">
            No
          </button>
        </div>
      </main>
    </Model>
  );
}
