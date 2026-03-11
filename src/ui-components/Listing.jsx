import React from "react";

export default function Listing({ children, layout = "grid" }) {

  return (
    <div
      className={
        layout === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-2"
          : "flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-2"
      }
    >
      {children}
    </div>
  );
}
