import React from "react";

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function MobileNavbar({ onOpenMenu, currentPage, user }) {
  const username = user?.username || "";
  const activeSchool = user?.active_school;

  return (
    <div className="lg:hidden flex items-center justify-between h-14 px-4 bg-slate-900 text-white shrink-0">
      {/* Left: hamburger + brand */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMenu}
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Brand icon */}
        <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        </div>

        <h1 className="text-sm font-semibold text-white truncate">
          {currentPage || "Control Desk"}
        </h1>
      </div>

      {/* Right: active school + user avatar */}
      <div className="flex items-center gap-2 shrink-0">
        {activeSchool?.label && (
          <span className="hidden xs:inline-flex text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-1 rounded-full truncate max-w-[120px]">
            {activeSchool.label}
          </span>
        )}
        {username && (
          <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
            {initials(username)}
          </div>
        )}
      </div>
    </div>
  );
}
