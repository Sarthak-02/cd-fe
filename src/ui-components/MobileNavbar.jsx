import React from "react";

export default function MobileNavbar({ onOpenMenu }) {
  return (
    <div
      className="
        lg:hidden flex items-center 
        fixed top-0 left-0 right-0 h-14
        px-4 bg-gray-800 text-white
        transition-all duration-300 ease-in-out
        z-30
      "
    >
      <button onClick={onOpenMenu} className="mr-4">
        <svg className="w-6 h-6" fill="none" stroke="currentColor">
          <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <h1 className="text-lg font-semibold">Dashboard</h1>
    </div>
  );
}
