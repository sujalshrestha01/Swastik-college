// POST /api/upload — single image upload (multer already processed req.file)
export function uploadSingle(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({ url, filename: req.file.filename, size: req.file.size });
}

// POST /api/upload/multiple — multiple image upload (used by gallery events)
export function uploadMultiple(req, res) {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  const files = req.files.map((f) => ({ url: `/uploads/${f.filename}`, filename: f.filename, size: f.size }));
  res.status(201).json({ files });
}
