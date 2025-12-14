export function convertImageToWebp(
    file,
    {
      quality = 0.8,       // 0 → 1
      maxWidth,
      maxHeight,
    } = {}
  ) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        return resolve(file);
      }
  
      const img = new Image();
      const url = URL.createObjectURL(file);
  
      img.onload = () => {
        let { width, height } = img;
  
        // Maintain aspect ratio
        if (maxWidth && width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
  
        if (maxHeight && height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
  
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
  
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
  
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject("WebP conversion failed");
  
            const webpFile = new File(
              [blob],
              file.name.replace(/\.\w+$/, ".webp"),
              { type: "image/webp" }
            );
  
            resolve(webpFile);
            URL.revokeObjectURL(url);
          },
          "image/webp",
          quality
        );
      };
  
      img.onerror = () => reject("Image load failed");
      img.src = url;
    });
  }
  