import React from "react";
import ExpComponent from "./ExpComponent";

export default function DevComponentPage() {
  return (
    <div className="bg-white p-8">
      <h1 className="text-red-800 text-4xl">This is an experimental page</h1>
      <ExpComponent />
    </div>
  );
}
