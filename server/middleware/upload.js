import multer from "multer";
import path from "path";

// Files land in memory as a Buffer (req.file.buffer / req.files[i].buffer)
// and are streamed straight to Cloudinary from the controller — nothing is
// ever written to local disk.
const storage = multer.memoryStorage();

// Images + PDF — PDFs are needed for notice attachments and the navbar
// "Download" resource, both of which accept "a PDF or an image".
//svg not included because Cloudinary doesn't support it. Also to prevent Cross-Site Scripting / XSS attacks.
const ALLOWED_TYPES = /jpeg|jpg|png|gif|webp|avif|pdf|heic|heif/;

function fileFilter(req, file, cb) {
  const extOk = ALLOWED_TYPES.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimeOk = ALLOWED_TYPES.test(file.mimetype);
  if (extOk && mimeOk) return cb(null, true);
  cb(
    new Error(
      "Only image files (jpg, png, gif, webp, avif, heic, heif) or PDFs are allowed",
    ),
  );
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024, files: 20 }, // 8MB per file, up to 20 in one request
});
