"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import useValidator, {
  getDefaultResetValidator,
  getDefaultValidator,
  syncValidateAll,
} from "../../hooks/useValidator";
import RefFormGroup from "../util/RefFormGroup";
import {
  flashed,
  flashedError,
  flashedSuccess,
} from "../../store/ApplicationSlice";
import Model from "../util/Model";
import { simpleBackend } from "../../../backend";
import { bucketsActions, createBucketThunk } from "../../store/BucketsSlice";

const identityList = { name: "Name must be 5 or more characters long" };
const validatorPredicates = { name: (str) => ({ isValid: str.length >= 5 }) };

export const labelCls = "block text-sm text-gray-400";

export const inputCls = {
  errorMessage: "text-red-500",
};

export default function CreateBucketModel() {
  const [requestLoading, setRequestLoading] = useState(false);
  const dispatchStore = useDispatch();
  const token = useSelector((state) => state.user.token);
  const bucketsCreateStatus = useSelector(
    (state) => state.buckets.createStatus
  );
  const nameRef = useRef();
  const [validityStatus, dispatchValidity, validate] = useValidator(
    identityList,
    validatorPredicates
  );
  const router = useRouter();

  useEffect(() => {
    if (
      nameRef.current.value === bucketsCreateStatus.id &&
      bucketsCreateStatus.status === 1
    ) {
      setRequestLoading(true);
    }

    if (
      nameRef.current.value === bucketsCreateStatus.id &&
      bucketsCreateStatus.status === 3
    ) {
      dispatchStore(flashedError("Failed to create bucket!"));
    }

    if (
      nameRef.current.value === bucketsCreateStatus.id &&
      bucketsCreateStatus.status === 2
    ) {
      close();
      dispatchStore(flashedSuccess("Bucket has been created!"));
    }
  }, [bucketsCreateStatus]);

  function close() {
    router.back();
  }

  function submitForm(e) {
    e.preventDefault();

    const currentValues = { name: nameRef.current.value };

    if (syncValidateAll(currentValues, validate)) {
      dispatchStore(createBucketThunk(currentValues, { Authorization: token }));
    }
  }
  return (
    <Model close={close}>
      <main className="relative z-20 shadow-lg max-w-lg bg-lightDark p-8 rounded mx-auto mt-10">
        <button
          className="absolute top-4 right-4 ml-auto text-white/50"
          onClick={close}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="text-3xl text-white/70 mb-2">Create Bucket</h2>
        <small className="block mb-4 max-w-xl text-white/50">
          Effectively manage your videos and images by through buckets
        </small>
        <form className="max-w-md" onSubmit={submitForm}>
          <RefFormGroup
            vData={validityStatus.name}
            id="name"
            label="Name (must be unique)"
            labelCls={labelCls}
            type="text"
            inputCls={inputCls}
            placeholder="Name here..."
            autoComplete="off"
            validate={getDefaultValidator(validate)}
            resetValidity={getDefaultResetValidator(dispatchValidity)}
            ref={nameRef}
            forInputEl={{ disabled: requestLoading }}
          />
          <button
            className="btn-mainAccent mt-4 w-full"
            disabled={requestLoading}
          >
            {requestLoading ? "Loading..." : "Create"}
          </button>
        </form>
      </main>
    </Model>
  );
}
