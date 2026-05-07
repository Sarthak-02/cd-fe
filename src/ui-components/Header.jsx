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

export default function Header({ currentPage, user, handleLogout }) {
  const username = user?.username || "User";
  const activeSchool = user?.active_school;
  const isAdmin = user?.isadmin;

  return (
    <header className="hidden lg:flex items-center justify-between h-14 bg-white border-b border-gray-100 px-6 shrink-0">
      {/* Left: page title */}
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-sm font-semibold text-gray-800 truncate">
          {currentPage || "Dashboard"}
        </h1>
        {activeSchool?.label && (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full shrink-0">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
            </svg>
            {activeSchool.label}
          </span>
        )}
      </div>

      {/* Right: user + logout */}
      <div className="flex items-center gap-3 shrink-0">
        {/* User pill */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
            {initials(username)}
          </div>
          <div className="hidden xl:block leading-tight">
            <p className="text-xs font-semibold text-gray-800">{username}</p>
            {isAdmin && (
              <p className="text-xs text-violet-600 font-medium">Admin</p>
            )}
          </div>
        </div>

        <div className="w-px h-5 bg-gray-200" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors px-2 py-1.5 rounded-md hover:bg-gray-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          <span className="hidden xl:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
