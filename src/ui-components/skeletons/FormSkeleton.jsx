export default function FormSkeleton() {
    return (
      <div className="animate-pulse space-y-6 p-6 bg-white rounded-xl shadow">
        {/* Title */}
        <div className="h-6 w-40 bg-gray-200 rounded"></div>
  
        {/* Form Fields */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              {/* Label */}
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              {/* Input */}
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
  
        {/* Two-column fields */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
  
        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <div className="h-10 w-24 bg-gray-200 rounded"></div>
          <div className="h-10 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  