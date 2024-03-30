import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { flashHidden } from "../../store/ApplicationSlice";

const typeClasses = {
  SUCCESS: { card: "bg-green-500", text: "text-black/80" },
  FAILURE: { card: "bg-red-500", text: "text-white/80" },
  INFO: { card: "bg-cyan-500", text: "text-black/80" },
};

const flashDuration = 4000;

export default function FlashMessage() {
  const flashState = useSelector((state) => state.app.flash);
  const timeoutRef = useRef({ timeout: null });
  const dispatchStore = useDispatch();

  const visibilityClasses = flashState.showing
    ? ""
    : "!right-0 translate-x-full";

  useEffect(() => {
    if (timeoutRef.current.timeout) {
      clearTimeout(timeoutRef.current.timeout);
    }
    timeoutRef.current.timeout = setTimeout(() => {
      dispatchStore(flashHidden());
    }, flashDuration);
  }, [flashState]);

  return (
    <div
      className={
        "px-4 py-3 rounded-sm fixed bottom-4 right-4 w-[400px] text-sm transition-transform " +
        typeClasses[flashState.type]["card"] +
        " " +
        visibilityClasses
      }
    >
      <p className={"" + typeClasses[flashState.type]["text"]}>
        {flashState.msg}
      </p>
      <button
        className={
          "absolute top-1 right-1 " + typeClasses[flashState.type]["text"]
        }
        onClick={() => dispatchStore(flashHidden())}
      >
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
  );
}
