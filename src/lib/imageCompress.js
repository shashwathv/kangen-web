// The API rejects any single image over 15MB (see MAX_IMAGE_BYTES in
// KanZen/src/routes/process.py), but modern phone cameras routinely produce
// photos well past that — especially high-megapixel or HEIC captures. The
// backend already downsamples every image to a 1600px longest edge before
// running it through the vision model, so shrinking oversized images here
// costs nothing in quality and avoids a confusing rejection for a perfectly
// normal photo.
const SAFE_BYTES = 14 * 1024 * 1024; // stay under the server's 15MB cap with headroom
const MAX_EDGE = 2400;
const START_QUALITY = 0.85;
const MIN_QUALITY = 0.5;

export async function compressImageIfNeeded(file) {
  if (file.size <= SAFE_BYTES) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();

    let quality = START_QUALITY;
    let blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", quality));
    while (blob && blob.size > SAFE_BYTES && quality > MIN_QUALITY) {
      quality -= 0.1;
      blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", quality));
    }

    if (!blob || blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^./\\]+$/, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg" });
  } catch {
    // Browser couldn't decode this file client-side (e.g. HEIC on non-Safari) —
    // fall back to the original and let the server-side check handle it.
    return file;
  }
}

export async function compressImages(files) {
  return Promise.all(files.map(compressImageIfNeeded));
}
