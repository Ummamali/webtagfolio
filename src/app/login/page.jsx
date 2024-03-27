"use client";
import Image from "next/image";
import "./login.css";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { lora } from "../fonts";
import useValidator, {
  getDefaultResetValidator,
  getDefaultValidator,
  syncValidateAll,
} from "../../hooks/useValidator.js";
import {
  identityList,
  validatorPredicates,
  labelCls,
  inputCls,
} from "./formConfig.js";
import RefFormGroup from "../util/RefFormGroup";
import { simpleBackend } from "../../../backend";

export default function LogIn() {
  const [err, setErr] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const emailRef = useRef();
  const passRef = useRef();
  const router = useRouter();
  const [validityStatus, dispatchValidity, validate] = useValidator(
    identityList,
    validatorPredicates
  );

  function check(e) {
    e.preventDefault();

    const currentValues = {
      email: emailRef.current.value,
      password: passRef.current.value,
    };

    if (syncValidateAll(currentValues, validate)) {
      async function requestBackend() {
        const reqObj = { ...currentValues };
        const res = await fetch(simpleBackend.urls.login, {
          method: "POST",
          headers: {
            "CONTENT-TYPE": "application/json",
          },
          body: JSON.stringify(reqObj),
        });
        if (res.ok) {
          const resObj = await res.json();
          const token = `Bearer ${resObj.token}`;
          localStorage.setItem("Authorization", token);
          localStorage.setItem("userId", resObj.userId);
          router.push("/dash");
        } else {
          throw new Error("Unable to Login");
        }
      }

      // sending the request
      setRequestLoading(true);
      requestBackend().catch((err) => {
        setRequestLoading(false);
        setErr("Unable to Log In");
        console.log(err.message);
      });
    }
  }

  return (
    <div className="h-screen bg-boardingDark flex">
      <div
        className={
          "w-7/12 h-full loginimg flex items-center justify-center lg:w-5/12 md:hidden"
        }
      >
        <div
          className="w-1/2 h-1/2 relative"
          style={{ mixBlendMode: "darken" }}
        >
          <Image
            src={"/logo.png"}
            alt="Some abstract background"
            fill={true}
            objectFit="contain"
          />
        </div>
      </div>
      <div className="flex-1 px-8">
        <div className="max-w-[450px] mx-auto mt-28">
          {err && (
            <p className="bg-red-800/50 text-white/60 py-2 px-8 rounded-sm text-sm text-center mb-4">
              {err}
            </p>
          )}
          <div className="mb-8">
            <Image
              src={"/logo.png"}
              width={30}
              height={30}
              className="block mx-auto translate-x-2 mb-2 md:hidden"
            />
            <h1
              className={`text-center md:text-left text-3xl text-gray-300/80 mb-1 ${lora.className}`}
            >
              Login
            </h1>
            <small className="text-center md:text-left block text-gray-300/50">
              Login to start managing your media assets
            </small>
          </div>

          <form className="space-y-5" onSubmit={check}>
            <RefFormGroup
              vData={validityStatus.email}
              id="email"
              label="Email"
              type="text"
              labelCls={labelCls}
              inputCls={inputCls}
              placeholder="Type email here..."
              autoComplete="off"
              validate={getDefaultValidator(validate)}
              resetValidity={getDefaultResetValidator(dispatchValidity)}
              ref={emailRef}
            />
            <RefFormGroup
              vData={validityStatus.password}
              id="password"
              label="Password"
              type="password"
              labelCls={labelCls}
              inputCls={inputCls}
              placeholder="Type password here..."
              autoComplete="off"
              validate={getDefaultValidator(validate)}
              resetValidity={getDefaultResetValidator(dispatchValidity)}
              ref={passRef}
            />
            <button
              type="submit"
              className="btn-mainAccent w-full shadow-lg"
              disabled={requestLoading}
            >
              {requestLoading ? "Loading..." : "Log In"}
            </button>
          </form>
          <p className="text-center text-gray-400 mt-2 font-light">
            <small>
              Don't have an account?{" "}
              <Link href={"/signup"} className="text-mainAccent font-normal">
                Sign Up
              </Link>
            </small>
          </p>
        </div>
      </div>
    </div>
  );
}
