const MAX_SIZE_BYTES = 1_000_000; // 1 MB
const MAX_DIMENSION = 1920;

/**
 * Compresses an image file client-side using Canvas.
 * Resizes to fit within MAX_DIMENSION and reduces JPEG quality
 * until the result is under 1 MB.
 */
export async function compressImage(file: File): Promise<File> {
  // If already under limit and is jpeg/webp, skip
  if (file.size <= MAX_SIZE_BYTES && /image\/(jpeg|webp)/.test(file.type)) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  // Scale down if either dimension exceeds max
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2d context");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // Try decreasing quality until under 1 MB
  let quality = 0.85;
  let blob: Blob;

  do {
    blob = await canvas.convertToBlob({ type: "image/jpeg", quality });
    quality -= 0.1;
  } while (blob.size > MAX_SIZE_BYTES && quality > 0.1);

  const name = file.name.replace(/\.[^.]+$/, ".jpg");
  return new File([blob], name, { type: "image/jpeg" });
}
