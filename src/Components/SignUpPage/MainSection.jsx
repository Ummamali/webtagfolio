"use client";
import useValidator, {
  getDefaultResetValidator,
  vActions,
} from "@/hooks/useValidator";
import React, { useRef } from "react";
import RefFormGroup from "../utils/RefFormGroup";

const identityList = { username: "Invalid username" };
const validatorPreds = {
  username: (str) => {
    return new Promise((res) => {
      setTimeout(() => res({ isValid: str.length > 0 }), 1000);
    });
  },
};
const asyncList = ["username"];

const fieldStyle = {
  normal:
    "block w-full bg-transparent border-b border-gray-100/10 pb-1 placeholder:text-gray-500/70 focus:outline-none text-gray-400/60",
  invalid: "!border-red-500 !text-red-500 placeholder:!text-red-500",
  loading: "animate-pulse",
  errorMessage: "text-red-500 italic",
};

export default function Main() {
  const [validityStatus, dispatchValidity, validate] = useValidator(
    identityList,
    validatorPreds,
    asyncList
  );
  console.log(validityStatus);
  const unameRef = useRef(null);
  return (
    <div>
      <div>
        <h1>Sign Up</h1>
        <small>Ragister to start using the application</small>
      </div>
      <form>
        <RefFormGroup
          vData={validityStatus.username}
          id="username"
          label="Username"
          labelCls="text-gray-500"
          inputCls={fieldStyle}
          type="text"
          placeholder="Provide username here..."
          autoComplete="off"
          validate={(e) => validate("username", e.target.value)}
          resetValidity={getDefaultResetValidator(dispatchValidity)}
          ref={unameRef}
        />
      </form>
    </div>
  );
}
