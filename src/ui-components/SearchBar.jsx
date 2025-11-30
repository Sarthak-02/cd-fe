import React, { useState, useEffect } from "react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  debounce = 0,
  className = "",
}) {
  const [internalValue, setInternalValue] = useState(value || "");

  // Debounce search input (optional)
  useEffect(() => {
    if (debounce > 0) {
      const timeout = setTimeout(() => {
        onChange?.(internalValue);
      }, debounce);
      return () => clearTimeout(timeout);
    } else {
      onChange?.(internalValue);
    }
  }, [internalValue]);

  return (
    <div
      className={`w-full flex items-center bg-white border border-gray-300 
      rounded-xl px-3 py-2 shadow-sm transition 
      focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 
      ${className}`}
    >
      {/* Search Icon */}
      <svg
        className="w-5 h-5 text-gray-500 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
        />
      </svg>

      {/* Search Input */}
      <input
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-2 text-sm md:text-base outline-none bg-transparent"
      />

      {/* Clear Button */}
      {internalValue && (
        <button
          onClick={() => setInternalValue("")}
          className="text-gray-400 hover:text-gray-600 transition text-sm"
        >
          ✕
        </button>
      )}
    </div>
  );
}
