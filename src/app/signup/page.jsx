"use client";
import Image from "next/image";
import "./signup.css";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { identityList, validatorPredicates } from "./formConfig.js";
import { inputCls, labelCls } from "../login/formConfig.js";
import useValidator, {
  getDefaultResetValidator,
  getDefaultValidator,
  syncValidateAll,
} from "../../hooks/useValidator";
import RefFormGroup from "../util/RefFormGroup";
import Link from "next/link";
import { simpleBackend } from "../../../backend";

export default function () {
  const [err, setErr] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const usernameRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();
  const conpassRef = useRef();
  const router = useRouter();
  const acceptRef = useRef();
  const [validityStatus, dispatchValidity, validate] = useValidator(
    identityList,
    validatorPredicates
  );

  function check(e) {
    e.preventDefault();

    if (passRef.current.value !== conpassRef.current.value) {
      setErr("Passwords dont match!");
      return null;
    }

    const currentValues = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passRef.current.value,
      confirmPassword: conpassRef.current.value,
    };

    if (syncValidateAll(currentValues, validate)) {
      // Your can use this template pattern of connecting to the backend
      async function requestBackend() {
        if (!acceptRef.current.checked) {
          console.log("err");
          throw new Error("Please accept terms and policies");
        }
        const { confirmPassword, ...reqObj } = currentValues;
        const res = await fetch(simpleBackend.urls.signup, {
          method: "POST",
          headers: {
            "CONTENT-TYPE": "application/json",
          },
          body: JSON.stringify(reqObj),
        });

        if (res.ok) {
          const resObj = await res.json();
          if (resObj.ack) {
            router.push(`/signup/verify?email=${reqObj.email}`);
          }
        } else {
          throw new Error("Registeration Failed. Please try again later");
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
    <div className="h-screen bg-boardingDark flex">
      <div
        className={
          "h-full w-7/12 signimg flex items-center justify-center md:hidden"
        }
      >
        <div
          className="w-1/2 h-1/2 relative"
          style={{ mixBlendMode: "overlay" }}
        >
          <Image
            src={"/logo.png"}
            alt="Some abstract background"
            fill={true}
            objectFit="contain"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="h-full px-24 lg:px-8 pt-20 pb-4">
          <div className="">
            {err && (
              <p className="bg-red-800 text-white/80 py-2 px-8 rounded-sm text-sm text-center mb-4">
                {err}
              </p>
            )}
            <div className="mb-8">
              <h1 className="text-4xl text-white/60 mb-3">Sign Up</h1>
              <small className="block text-white/50">
                Register to start managing your media assets
              </small>
            </div>

            <form className="space-y-5 mb-2" onSubmit={check}>
              <RefFormGroup
                vData={validityStatus.username}
                id="username"
                label="Username"
                labelCls={labelCls}
                type="text"
                inputCls={inputCls}
                placeholder="Username here..."
                autoComplete="off"
                validate={getDefaultValidator(validate)}
                resetValidity={getDefaultResetValidator(dispatchValidity)}
                ref={usernameRef}
              />
              <RefFormGroup
                vData={validityStatus.email}
                id="email"
                label="Email"
                labelCls={labelCls}
                type="text"
                inputCls={inputCls}
                placeholder="Email here..."
                autoComplete="off"
                validate={getDefaultValidator(validate)}
                resetValidity={getDefaultResetValidator(dispatchValidity)}
                ref={emailRef}
              />
              <RefFormGroup
                vData={validityStatus.password}
                id="password"
                label="Password"
                labelCls={labelCls}
                type="password"
                inputCls={inputCls}
                placeholder="Password here..."
                autoComplete="off"
                validate={getDefaultValidator(validate)}
                resetValidity={getDefaultResetValidator(dispatchValidity)}
                ref={passRef}
              />
              <RefFormGroup
                vData={validityStatus.confirmPassword}
                id="confirmPassword"
                label="Confirm Password"
                labelCls={labelCls}
                type="password"
                inputCls={inputCls}
                placeholder="Same password as above..."
                autoComplete="off"
                validate={getDefaultValidator(validate)}
                resetValidity={getDefaultResetValidator(dispatchValidity)}
                ref={conpassRef}
              />
              <div className="flex items-center space-x-2 px-2">
                <input
                  type="checkbox"
                  name="terms"
                  id="terms"
                  className=""
                  ref={acceptRef}
                />
                <label htmlFor="terms" className="text-gray-500/80 text-sm">
                  I have read and agree to the terms and conditions for usign
                  this application
                </label>
              </div>
              <button
                type="submit"
                className="btn-mainAccent w-full shadow-lg py-2 disabled:opacity-60"
                disabled={requestLoading}
              >
                {requestLoading ? "Please wait...." : "Sign Up"}
              </button>
            </form>
            <p className="text-gray-500 text-center">
              <small>
                Already have an account?{" "}
                <Link href={"/login"} className="text-mainAccent">
                  Log In
                </Link>
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
