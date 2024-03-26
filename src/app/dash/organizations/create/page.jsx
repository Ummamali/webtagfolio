"use client";
import React, { useRef, useState } from "react";
import useValidator, {
  getDefaultResetValidator,
  getDefaultValidator,
  syncValidateAll,
} from "../../../../hooks/useValidator";
import RefFormGroup from "../../../util/RefFormGroup";
import { useDispatch } from "react-redux";
import { flashed } from "../../../../store/ApplicationSlice";

const identityList = { name: "Please provide a valid name" };
const validatorPredicates = { name: (str) => ({ isValid: str.length >= 5 }) };

export const labelCls = "block text-sm text-gray-400";

export const inputCls = {
  errorMessage: "text-red-500",
};

export default function CreateOrganization() {
  const [requestLoading, setRequestLoading] = useState(false);
  const dispatchStore = useDispatch();
  const [err, setErr] = useState("");
  const nameRef = useRef();
  const [validityStatus, dispatchValidity, validate] = useValidator(
    identityList,
    validatorPredicates
  );

  function submitForm(e) {
    e.preventDefault();
    dispatchStore(flashed({ msg: "Button clicked", type: "FAILURE" }));
  }
  return (
    <div>
      <h2 className="text-3xl text-white/70 mb-2">Create Organization</h2>
      <small className="block mb-4 max-w-xl text-white/50">
        Effectively manage your organization by establishing clear communication
        channels
      </small>
      <form className="max-w-md" onSubmit={submitForm}>
        <RefFormGroup
          vData={validityStatus.name}
          id="name"
          label="Name"
          labelCls={labelCls}
          type="text"
          inputCls={inputCls}
          placeholder="Name here..."
          autoComplete="off"
          validate={getDefaultValidator(validate)}
          resetValidity={getDefaultResetValidator(dispatchValidity)}
          ref={nameRef}
        />
        <button
          className="btn-mainAccent mt-4 w-full"
          disabled={requestLoading}
        >
          {requestLoading ? "Loading..." : "Create"}
        </button>
      </form>
    </div>
  );
}
