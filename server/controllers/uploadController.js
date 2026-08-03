import heicConvert from "heic-convert";
import cloudinary from "../config/cloudinary.js";

function isHeic(file) {
  return (
    /\.(heic|heif)$/i.test(file.originalname) ||
    ["image/heic", "image/heif"].includes(file.mimetype)
  );
}

async function normalizeIfHeic(file) {
  if (!isHeic(file)) return file;
  const outputBuffer = await heicConvert({
    buffer: file.buffer,
    format: "JPEG",
    quality: 0.9,
  });
  return {
    ...file,
    buffer: outputBuffer,
    originalname: file.originalname.replace(/\.(heic|heif)$/i, ".jpg"),
    mimetype: "image/jpeg",
  };
}

function uploadBufferToCloudinary(buffer, resourceType) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "swastik-college", resource_type: resourceType },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    stream.end(buffer);
  });
}

async function processAndUpload(file) {
  const normalized = await normalizeIfHeic(file);
  // PDFs need resource_type 'image' too (Cloudinary serves/thumbnails them
  // under the image endpoint) — 'auto' lets Cloudinary pick correctly either way.
  const result = await uploadBufferToCloudinary(normalized.buffer, "auto");
  return {
    url: result.secure_url,
    publicId: result.public_id,
    size: result.bytes,
  };
}

export async function uploadSingle(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  try {
    const result = await processAndUpload(req.file);
    return res.status(201).json(result);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to process image", error: err.message });
  }
}

export async function uploadMultiple(req, res) {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }
  try {
    const files = await Promise.all(req.files.map(processAndUpload));
    return res.status(201).json({ files });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to process images", error: err.message });
  }
}
