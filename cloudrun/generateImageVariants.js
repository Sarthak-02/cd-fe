import { Storage } from "@google-cloud/storage";
import sharp from "sharp";
import path from "path";
import os from "os";
import fs from "fs/promises";

const storage = new Storage();
const BUCKET = "campus360";

export async function generateVariants(event) {
  const filePath = event.name;

  // Only process originals
  if (!filePath.startsWith("profile-images/original/")) return;

  const bucket = storage.bucket(BUCKET);
  const fileName = path.basename(filePath);
  const [entity, idWithExt] = filePath.split("/").slice(-2);
  const id = idWithExt.split(".")[0];

  const tempOriginal = path.join(os.tmpdir(), fileName);
  await bucket.file(filePath).download({ destination: tempOriginal });

  const image = sharp(tempOriginal).rotate(); // auto-fix orientation

  const variants = [
    { name: "small", size: 128 },
    { name: "medium", size: 512 },
    { name: "full", size: 1024 },
  ];

  for (const v of variants) {
    const output = await image
      .resize(v.size, v.size, { fit: "cover" })
      .webp({ quality: 80 })
      .toBuffer();

    const outputPath = `profile-images/${entity}/${id}/${v.name}.webp`;

    await bucket.file(outputPath).save(output, {
      contentType: "image/webp",
      cacheControl: "public, max-age=31536000",
    });
  }

  // Optional: delete original
  // await bucket.file(filePath).delete();

  await fs.unlink(tempOriginal);
}
