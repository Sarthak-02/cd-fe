import React from "react";

export default function Header() {
  return (
    <header
      className="
        hidden lg:flex items-center justify-between 
        fixed top-0 left-0 right-0 h-14 
        bg-gray-900 text-white px-6 shadow-md
        z-30
      "
    >
      <h1 className="text-lg font-semibold"></h1>

      <div className="text-sm text-gray-300">
        Welcome, Admin
      </div>
    </header>
  );
}
