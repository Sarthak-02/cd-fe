import React from "react";

export default function CardSkeleton() {
  return (
    <div className="w-full bg-white shadow-sm rounded-2xl p-4 border animate-pulse flex gap-4">
      <div className="w-16 h-16 bg-gray-200 rounded-xl" />

      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />

        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}
