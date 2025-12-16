import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function TextArea({
  label,
  value = "",
  onChange,
  placeholder = "",
  rows = 4,
  maxLength,
  error,
  required = false,
  disabled = false,
  hint,

  // ⭐ NEW
  markdown = false,
}) {
  const [preview, setPreview] = useState(false);

  return (
    <div className="space-y-1 w-full">
      {/* Label */}
      {label && (
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {markdown && (
            <button
              type="button"
              onClick={() => setPreview((p) => !p)}
              className="text-xs text-blue-600 hover:underline"
            >
              {preview ? "Edit" : "Preview"}
            </button>
          )}
        </div>
      )}

      {/* Editor / Preview */}
      {markdown && preview ? (
        <div className="border rounded-lg p-3 bg-gray-50 min-h-[96px]">
          {value ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="prose prose-sm max-w-none"
            >
              {value}
            </ReactMarkdown>
          ) : (
            <p className="text-sm text-gray-400">Nothing to preview</p>
          )}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          className={`
            w-full rounded-lg border px-3 py-2 text-sm resize-none
            focus:outline-none focus:ring-2
            ${
              error
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
            }
            ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
          `}
        />
      )}

      {/* Footer */}
      <div className="flex justify-between text-xs">
        <span className="text-red-500">{error}</span>
        {maxLength && (
          <span className="text-gray-400">
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      {/* Hint */}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}

      {/* Markdown hint */}
      {markdown && !hint && (
        <p className="text-xs text-gray-400">
          Supports basic formatting (Markdown)
        </p>
      )}
    </div>
  );
}
