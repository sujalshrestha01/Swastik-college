import cloudinary from "../config/cloudinary.js";

// Matches a Cloudinary delivery URL and captures the resource type
// (image|video|raw) and the public_id (folder/filename, no extension,
// no version segment) — e.g.:
// https://res.cloudinary.com/demo/image/upload/v1699999999/swastik-college/abc123.jpg
// -> resourceType: "image", publicId: "swastik-college/abc123"
const CLOUDINARY_URL_RE =
  /res\.cloudinary\.com\/[^/]+\/(image|video|raw)\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/;

/**
 * Deletes a previously-uploaded file so replacing or removing an image/PDF
 * never leaves the old one orphaned in storage. Safe to call with an empty
 * string, a non-Cloudinary URL (e.g. a leftover local /uploads/ path from
 * before this migration), or a URL that's already been deleted — all of
 * those are silently ignored rather than thrown as errors, since a stale
 * DB reference to a missing file should never block a save.
 */
export async function deleteUploadedFile(url) {
  if (!url) return;

  const match = url.match(CLOUDINARY_URL_RE);
  if (!match) return; // not a Cloudinary URL — nothing we can safely delete

  const [, resourceType, publicId] = match;
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (err) {
    console.error(
      `Failed to delete Cloudinary asset ${publicId}:`,
      err.message,
    );
  }
}
