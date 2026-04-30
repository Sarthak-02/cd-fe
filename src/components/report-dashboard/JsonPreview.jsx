import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function JsonPreview({ data }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(data, null, 2);

  function handleCopy() {
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs rounded-lg transition"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        {copied ? "Copied!" : "Copy"}
      </button>
      <div className="bg-gray-900 text-green-300 text-xs rounded-xl p-4 overflow-auto max-h-96">
        <pre className="whitespace-pre-wrap break-words">{json}</pre>
      </div>
    </div>
  );
}
