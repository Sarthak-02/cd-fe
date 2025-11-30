import React from "react";

export default function CheckBox({
  checked = false,
  onChange,
  title,
  description,
  disabled = false,
  width = "w-full",
  error =  false 
}) {
  return (
    <div className={`flex flex-col ${width}`}>
      <label
        className={`
          flex items-start gap-3 p-3 border rounded-lg cursor-pointer 
          transition-all duration-200
          ${checked ? "border-blue-600 bg-blue-50" : "border-gray-300"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${error ? "border-red-500 bg-red-50" : ""}
        `}
      >
        {/* Checkbox */}
        <input
          type="checkbox"
          className="h-5 w-5"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />

        {/* Title + Description */}
        <div className="flex flex-col -mt-0.5">
          <span className="font-medium text-gray-900">{title}</span>
          {description && (
            <span className="text-sm text-gray-600 leading-tight">
              {description}
            </span>
          )}
        </div>
      </label>

      {/* Error message
      {error && (
        <span className="text-xs text-red-500 mt-1">{error}</span>
      )} */}
    </div>
  );
}
