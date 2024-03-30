import React from "react";
import Model from "../../util/Model";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { orgActions } from "../../../store/OrgSlice";
import { flashedError, flashedInfo } from "../../../store/ApplicationSlice";
import { simpleBackend } from "../../../../backend";

export default function DeleteOrgModel() {
  const token = useSelector((state) => state.user.token);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatchStore = useDispatch();

  function close() {
    router.back();
  }

  function deleteOrg() {
    // First we contact the backend to delete the organization
    async function deleteOrganization() {
      const res = await fetch(simpleBackend.urls.deleteOrg, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ orgId: searchParams.get("orgId") }),
      });

      if (res.ok) {
        const resObj = await res.json();
        console.log(resObj);

        // Then we update the frontend
        dispatchStore(orgActions.orgDeleted(searchParams.get("orgId")));
        dispatchStore(flashedInfo("Organization Deleted!"));
        close();
      } else {
        throw new Error("Unable to delete organization");
      }
    }

    deleteOrganization().catch((err) =>
      dispatchStore(flashedError("Unable to delete organization"))
    );
  }
  return (
    <Model close={close}>
      <main className="model-main">
        <h3 className="text-white/70 text-3xl">Delete Organization</h3>
        <p className="text-white/50 leading-tight">
          <small>
            Initiating the removal of an organization can delete the shared
            resources between members.Are you sure you want to delete
            organization?
          </small>
        </p>
        <div className="space-x-4 mt-7">
          <button
            className="btn border border-red-500 rounded-sm text-red-500 font-semibold px-10"
            onClick={deleteOrg}
          >
            Yes
          </button>
          <button
            onClick={close}
            className="btn border border-gray-300 text-gray-300 rounded-sm px-10"
          >
            No
          </button>
        </div>
      </main>
    </Model>
  );
}
