"use client";
import React, { useRef, useState } from "react";
import RefFormGroup from "../../util/RefFormGroup";
import useValidator, {
  getDefaultResetValidator,
  getDefaultValidator,
  syncValidateAll,
} from "../../../hooks/useValidator";
import { simpleBackend } from "../../../../backend";
import { useSearchParams, useRouter } from "next/navigation";

const identityList = { code: "Please provide a 6 digit code" };
const validatorPredicates = {
  code: (str) => ({ isValid: /^\d{6}$/.test(str) }),
};
export const labelCls = "block text-sm text-gray-400";

export const inputCls = {
  errorMessage: "text-red-500",
};

export default function verifyregisteration() {
  const codeRef = useRef();
  const [requestLoading, setRequestLoading] = useState(false);
  const [err, setErr] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [validityStatus, dispatchValidity, validate] = useValidator(
    identityList,
    validatorPredicates
  );

  function submitForm(e) {
    e.preventDefault();
    const currentValues = { code: codeRef.current.value };
    if (syncValidateAll(currentValues, validate)) {
      async function requestBackend() {
        const reqObj = {
          verify: currentValues.code,
          email: searchParams.get("email"),
        };
        const res = await fetch(simpleBackend.urls.signUpVerify, {
          method: "POST",
          headers: {
            "CONTENT-TYPE": "application/json",
          },
          body: JSON.stringify(reqObj),
        });

        if (res.ok) {
          const resObj = await res.json();
          if (resObj.ack) {
            router.push("/user/login");
          }
        } else {
          throw new Error("Unable to verify your account");
        }
      }

      // sending the request
      setRequestLoading(true);
      requestBackend().catch((err) => {
        setRequestLoading(false);
        setErr(err.message);
      });
    }
  }
  return (
    <div className="h-screen bg-boardingDark">
      <div className="mb-8 text-center px-4 py-10">
        {err && (
          <p className="bg-red-800/20 text-red-600 text-white/80 py-2 px-8 rounded-sm text-sm text-center mb-4">
            {err}
          </p>
        )}
        <h1 className="text-4xl text-white/60 mb-3">Verify Your Signup</h1>
        <small className="block text-white/50">
          Verify your registeration request. Register to start managing your
          media assets
        </small>
      </div>
      <form className="max-w-md mx-auto" onSubmit={submitForm}>
        <RefFormGroup
          vData={validityStatus.code}
          id="code"
          label="Verification Code"
          labelCls={labelCls}
          type="text"
          inputCls={inputCls}
          placeholder="Code here..."
          autoComplete="off"
          validate={getDefaultValidator(validate)}
          resetValidity={getDefaultResetValidator(dispatchValidity)}
          ref={codeRef}
        />
        <button
          className="btn-mainAccent mt-4 w-full"
          disabled={requestLoading}
        >
          {requestLoading ? "Loading..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
