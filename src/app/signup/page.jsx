"use client";
import Image from "next/image";
import "./signup.css";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function () {
  const [err, setErr] = useState(false);
  const nameRef = useRef();
  const passRef = useRef();
  const conpassRef = useRef();
  const router = useRouter();

  function check(e) {
    e.preventDefault();

    if (passRef.current.value !== conpassRef.current.value) {
      setErr("Passwords dont match!");
      return null;
    }

    const data = {
      username: nameRef.current.value,
      password: passRef.current.value,
    };
    fetch("http://127.0.0.1:5500/signup", {
      method: "POST",
      headers: {
        "CONTENT-TYPE": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) =>
      res.json().then((resObj) => {
        if (resObj.acknowledged) {
          router.push("/login");
        }
      })
    );
  }

  return (
    <div className="h-screen bg-boardingDark flex">
      <div className={"flex-1 h-full signimg flex items-center justify-center"}>
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
      <div className="flex-1">
        <div className="flex-1 px-8">
          <div className="max-w-[450px] mx-auto mt-20">
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

            <form className="space-y-7" onSubmit={check}>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm text-white/50"
                >
                  Username
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  name="username"
                  id="username"
                  autoComplete="off"
                  className="block border-b border-gray-600 bg-transparent w-full focus:outline-none focus:border-gray-400 text-white/70"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm text-white/50"
                >
                  Password
                </label>
                <input
                  ref={passRef}
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="off"
                  className="block border-b border-gray-600 bg-transparent w-full focus:outline-none focus:border-gray-400 text-white/70"
                />
              </div>
              <div>
                <label
                  htmlFor="confpassword"
                  className="block text-sm text-white/50"
                >
                  Confirm Password
                </label>
                <input
                  ref={conpassRef}
                  type="password"
                  name="confpassword"
                  id="confpassword"
                  autoComplete="off"
                  className="block border-b border-gray-600 bg-transparent w-full focus:outline-none focus:border-gray-400 text-white/70"
                />
              </div>
              <button
                type="submit"
                className="bg-mainAccent text-white w-full py-1 px-4 rounded-sm shadow font-light mt-4"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
