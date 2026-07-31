
import path from 'path';
import fs from 'fs/promises';
import heicConvert from 'heic-convert';
import { UPLOADS_DIR } from '../middleware/upload.js';

async function normalizeIfHeic(file) {
  const isHeic = /\.(heic|heif)$/i.test(file.filename) ||
                 ['image/heic', 'image/heif'].includes(file.mimetype);
  if (!isHeic) {
    return { filename: file.filename, size: file.size };
  }

  const inputPath = path.join(UPLOADS_DIR, file.filename);
  const parsed = path.parse(file.filename);
  const newFilename = `${parsed.name}.jpg`;
  const outputPath = path.join(UPLOADS_DIR, newFilename);

  try {
    const inputBuffer = await fs.readFile(inputPath);
    const outputBuffer = await heicConvert({ buffer: inputBuffer, format: 'JPEG', quality: 0.9 });
    await fs.writeFile(outputPath, outputBuffer);
    await fs.unlink(inputPath).catch(() => {});
    return { filename: newFilename, size: outputBuffer.length };
  } catch (err) {
    await fs.unlink(inputPath).catch(() => {});
    throw new Error(`Failed to convert HEIC image: ${err.message}`);
  }
}

export async function uploadSingle(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  try {
    const { filename, size } = await normalizeIfHeic(req.file);
    return res.status(201).json({ url: `/uploads/${filename}`, filename, size });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to process image', error: err.message });
  }
}

export async function uploadMultiple(req, res) {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  try {
    const files = await Promise.all(
      req.files.map((file) => normalizeIfHeic(file).then(({ filename, size }) => ({
        url: `/uploads/${filename}`,
        filename,
        size,
      })))
    );
    return res.status(201).json({ files });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to process images', error: err.message });
  }
}