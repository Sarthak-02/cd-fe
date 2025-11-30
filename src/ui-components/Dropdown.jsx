import React, { useState, useRef, useEffect } from "react";

export default function Dropdown({
  label,
  options = [],
  multi = false,
  placeholder = "Select...",
  selected,
  onChange,
  width = 'w-full',
  error=false
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (multi) {
      if (selected?.includes(option.value)) {
        onChange(selected.filter((v) => v !== option.value)); // Remove
      } else {
        onChange([...(selected || []), option.value]); // Add
      }
    } else {
      onChange(option.value);
      setOpen(false);
    }
  };

  const renderLabel = () => {
    if (multi) {
      if (!selected?.length) return placeholder;
      return options
        .filter((o) => selected.includes(o.value))
        .map((o) => o.label)
        .join(", ");
    }

    const option = options.find((o) => o.value === selected);
    return option ? option.label : placeholder;
  };

  return (
    <div className={`${width} relative `} ref={ref}>
      {label && (
        <label className="block mb-1 text-sm text-gray-600">{label}</label>
      )}

      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full border ${error && 'border-red-500' } bg-white px-3 py-2 rounded-lg text-left flex justify-between items-center`}
      >
        <span className="text-gray-800">
          {renderLabel()}
        </span>
        <span className="text-gray-500">▼</span>
      </button>

      {/* Dropdown List */}
      {open && (
        <div className="absolute z-20 mt-2 w-full bg-white shadow-lg border rounded-lg max-h-60 overflow-y-auto">
          {options.map((opt) => {
            const active = multi
              ? selected?.includes(opt.value)
              : selected === opt.value;

            return (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt)}
                className={`px-3 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-100 ${
                  active ? "bg-blue-50" : ""
                }`}
              >
                <span>{opt.label}</span>

                {active && (
                  <span className="text-blue-600 text-sm font-bold">✓</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
