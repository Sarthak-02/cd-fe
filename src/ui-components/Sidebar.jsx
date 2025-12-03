import React from "react";
import { useAuth } from "../store/auth.store";

export default function Sidebar({ collapsed, toggleCollapse, currentPage, onSelect, paths,handleLogout }) {

  const {logout} = useAuth()
  return (
    <div
      className={`
        h-full bg-gray-800 text-white transition-all duration-300 flex flex-col
        ${collapsed ? "w-20" : "w-60"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <h1
            className="text-xl font-bold cursor-pointer"
            onClick={() => onSelect("", "/")}
          >
            Dashboard
          </h1>
        )}

        {/* Collapse Button */}
        <button
          onClick={toggleCollapse}
          className="text-gray-300 hover:text-white"
        >
          {collapsed ? (
            <svg width="20" height="20" fill="none" stroke="currentColor">
              <path strokeWidth="2" d="M15 6l-6 6 6 6" />
            </svg>
          ) : (
            <svg width="20" height="20" fill="none" stroke="currentColor">
              <path strokeWidth="2" d="M9 6l6 6-6 6" />
            </svg>
          )}
        </button>
      </div>

      {/* Menu */}
      <nav className="mt-4 space-y-2 flex-1">
        {paths.map((item) => (
          <button
            key={item.label}
            onClick={() => onSelect(item.label, item.path)}
            className={`
              flex items-center px-4 py-2 w-full rounded-md transition
              ${currentPage === item.label ? "bg-gray-700" : "hover:bg-gray-700"}
            `}
          >
            <span className="text-gray-200">{item.icon}</span>

            {!collapsed && (
              <span className="ml-3 text-md">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout Button (Bottom) */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => onSelect("Logout", "/logout")}
          className="flex items-center w-full px-4 py-2 rounded-md hover:bg-gray-700 transition"
        >
          <span className="text-gray-200">
            {/* Logout Icon */}
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 12H3" />
              <path d="M10 7l5 5-5 5" />
            </svg>
          </span>

          {!collapsed && (
            <span className="ml-3 text-md" onClick={handleLogout}>Logout</span>
          )}
        </button>
      </div>
    </div>
  );
}
