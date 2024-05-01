"use client";
import React from "react";
import ExpComponent from "./ExpComponent";
import { cacheStudents, fetchStudents } from "../../store/ExpStudentsSlice";
import { useDispatch } from "react-redux";

export default function DevComponentPage() {
  const dispatchStore = useDispatch();
  return (
    <div className="bg-white p-8">
      <h1 className="text-red-800 text-4xl">This is an experimental page</h1>
      <button
        onClick={() => {
          dispatchStore(fetchStudents());
        }}
      >
        Run it
      </button>
      <br />
      <button
        onClick={() => {
          dispatchStore(cacheStudents());
        }}
      >
        cache it
      </button>
    </div>
  );
}
