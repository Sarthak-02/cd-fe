import React, { useRef, useState } from "react";
import { X } from "lucide-react";
import { convertImageToWebp } from "../utils/convertImageToWebp";

export default function DocumentUploader({
  label = "Upload File",
  accept = [],
  maxSizeMB,
  maxFiles = 1,
  imageConfig,
  multiple = false,
  onChange,
  url = "", // existing file URL (edit mode)
}) {
  console.log("url", url);
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [items, setItems] = useState(() =>
    url ? [{ type: "remote", url }] : []
  );

  function validateFile(file) {
    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      return `File size should not exceed ${maxSizeMB}MB`;
    }

    if (accept.length && !accept.includes(file.type)) {
      return `Invalid file format`;
    }

    return null;
  }

  function validateImageResolution(file) {
    return new Promise((resolve, reject) => {
      if (!imageConfig) resolve(true);

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const { width, height } = img;
        const { minWidth, minHeight, maxWidth, maxHeight } = imageConfig;

        if (
          (minWidth && width < minWidth) ||
          (minHeight && height < minHeight)
        ) {
          reject(`Minimum resolution is ${minWidth}x${minHeight}px`);
        }

        if (
          (maxWidth && width > maxWidth) ||
          (maxHeight && height > maxHeight)
        ) {
          reject(`Maximum resolution is ${maxWidth}x${maxHeight}px`);
        }

        resolve(true);
      };

      img.onerror = () => reject("Invalid image");
    });
  }
  
  async function handleChange(e) {
    setError("");
    let selectedFiles = Array.from(e.target.files);

    if (items.length + selectedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} file(s) allowed`);
      return;
    }

    const processedFiles = [];

    for (const file of selectedFiles) {
      const errorMsg = validateFile(file);
      if (errorMsg) {
        setError(errorMsg);
        return;
      }

      let processedFile = file;

      // 🔥 Convert to WebP
      if (file.type.startsWith("image/")) {
        try {
          processedFile = await convertImageToWebp(file, {
            quality: 0.8,
            maxWidth: imageConfig?.maxWidth,
            maxHeight: imageConfig?.maxHeight,
          });

          await validateImageResolution(processedFile);
        } catch (err) {
          setError(err);
          return;
        }
      }

      processedFiles.push(processedFile);
    }

    const newItems = processedFiles.map((file) => ({
      type: "local",
      file,
    }));

    const updatedItems = multiple ? [...items, ...newItems] : newItems;

    setItems(updatedItems);

    const filesOnly = updatedItems
      .filter((i) => i.type === "local")
      .map((i) => i.file);

    onChange(multiple ? filesOnly : filesOnly[0] || null);

    inputRef.current.value = "";
  }

  // async function handleChange(e) {
  //   setError("");
  //   const selectedFiles = Array.from(e.target.files);

  //   if (items.length + selectedFiles.length > maxFiles) {
  //     setError(`Maximum ${maxFiles} file(s) allowed`);
  //     return;
  //   }

  //   for (const file of selectedFiles) {
  //     const errorMsg = validateFile(file);
  //     if (errorMsg) {
  //       setError(errorMsg);
  //       return;
  //     }

  //     if (file.type.startsWith("image/")) {
  //       try {
  //         await validateImageResolution(file);
  //       } catch (err) {
  //         setError(err);
  //         return;
  //       }
  //     }
  //   }

  //   const newItems = selectedFiles.map((file) => ({
  //     type: "local",
  //     file,
  //   }));

  //   const updatedItems = multiple
  //     ? [...items, ...newItems]
  //     : newItems;

  //   setItems(updatedItems);

  //   // Emit only new files to parent
  //   const filesOnly = updatedItems
  //     .filter((i) => i.type === "local")
  //     .map((i) => i.file);

  //   onChange(multiple ? filesOnly : filesOnly[0] || null);

  //   inputRef.current.value = "";
  // }

  function removeItem(index) {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);

    const filesOnly = updated
      .filter((i) => i.type === "local")
      .map((i) => i.file);

    onChange(multiple ? filesOnly : filesOnly[0] || null);
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}

      {/* Upload Box */}
      <div
        onClick={() => inputRef.current.click()}
        className={`border border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50
        ${items.length >= maxFiles ? "opacity-50 pointer-events-none" : ""}`}
      >
        <p className="text-sm text-gray-600">
          Click to upload (max {maxFiles})
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept.join(",")}
        multiple={multiple && maxFiles > 1}
        onChange={handleChange}
      />

      {/* Preview */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((item, index) => {
            const isImage =
              item.type === "remote" || item.file?.type?.startsWith("image/");

            const src =
              item.type === "remote"
                ? item.url
                : URL.createObjectURL(item.file);

            return (
              <div key={index} className="relative border rounded-lg p-2">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>

                {isImage ? (
                  <img
                    src={src}
                    alt="preview"
                    className="h-24 w-full object-cover rounded"
                  />
                ) : (
                  <p className="text-xs truncate">
                    {item.file?.name || "Document"}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
