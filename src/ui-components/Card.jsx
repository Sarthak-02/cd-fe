import React from "react";

/**
 * CommonCard Component
 * - Shows an image (optional)
 * - Title
 * - Subtitle
 * - Additional key-value details
 */
export default function Card({ image, title, subtitle, details = {}, onClick }) {
    // console.log(image,title,subtitle)
  return (
    <div
      onClick={onClick}
      className="w-full bg-white shadow-sm rounded-2xl p-4 border hover:shadow-md cursor-pointer transition-all flex gap-4"
    >
      {image && (
        <img
          src={image}
          alt={title}
          className="w-16 h-16 rounded-xl object-cover"
        />
      )}

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}

        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <span className="text-gray-400 text-xs">{key}</span>
              <span className="text-gray-700 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
