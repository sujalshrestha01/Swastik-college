import { PDFParse } from "pdf-parse";
import cloudinary from "../config/cloudinary.js";
import { deleteUploadedFile } from "../utils/cloudinaryHelpers.js";
import KnowledgeDoc from "../models/KnowledgeDoc.js";
import KnowledgeChunk from "../models/KnowledgeChunk.js";
import { chunkText } from "../utils/textChunker.js";
import { embedDocumentChunks } from "../utils/embeddings.js";

function uploadBufferToCloudinary(buffer, filename) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "swastik-college/knowledge-base",
        resource_type: "auto",
        // Keep the original filename recognizable in the Cloudinary asset
        // list, which makes manual admin cleanup there easier too.
        public_id: filename.replace(/\.pdf$/i, ""),
      },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    stream.end(buffer);
  });
}

// POST /api/knowledge/upload — admin uploads a PDF. Responds as soon as the
// PDF is stored + a KnowledgeDoc row exists (status "processing"), then
// finishes text extraction/chunking/embedding in the background so the
// admin's UI doesn't hang on a big file. The admin's doc list polls or
// refreshes to see status flip to "ready".
export async function uploadKnowledgePdf(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No PDF uploaded" });
  }
  if (!/\.pdf$/i.test(req.file.originalname)) {
    return res.status(400).json({ message: "Only PDF files are supported" });
  }

  let doc;
  try {
    const cloudinaryResult = await uploadBufferToCloudinary(
      req.file.buffer,
      req.file.originalname,
    );

    doc = await KnowledgeDoc.create({
      filename: req.file.originalname,
      cloudinaryUrl: cloudinaryResult.secure_url,
      cloudinaryPublicId: cloudinaryResult.public_id,
      sizeBytes: req.file.size,
      uploadedBy: req.admin?.id,
      status: "processing",
    });

    res.status(202).json({ doc });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to upload PDF", error: err.message });
  }

  // Background ingestion — response has already been sent above. Any
  // failure here must update the doc's status to "failed" (not just log),
  // or the admin UI is stuck showing "processing" forever with no clue why.
  processDocumentIngestion(doc, req.file.buffer).catch(async (err) => {
    console.error(`Knowledge ingestion failed for ${doc._id}:`, err);
    await KnowledgeDoc.findByIdAndUpdate(doc._id, {
      status: "failed",
      error: err.message || "Ingestion failed unexpectedly.",
    }).catch(() => {}); // if even this fails, we've already logged above
  });
}

async function processDocumentIngestion(doc, buffer) {
  const parser = new PDFParse({ data: buffer });
  let extracted;
  try {
    extracted = await parser.getText();
  } finally {
    await parser.destroy();
  }

  const rawText = extracted.text || "";
  if (!rawText.trim()) {
    await KnowledgeDoc.findByIdAndUpdate(doc._id, {
      status: "failed",
      error: "No extractable text found in this PDF (it may be scanned images).",
    });
    return;
  }

  const chunks = chunkText(rawText);
  if (chunks.length === 0) {
    await KnowledgeDoc.findByIdAndUpdate(doc._id, {
      status: "failed",
      error: "PDF text could not be split into chunks.",
    });
    return;
  }

  const embeddings = await embedDocumentChunks(chunks);

  const chunkDocs = chunks.map((text, i) => ({
    docId: doc._id,
    chunkIndex: i,
    text,
    embedding: embeddings[i],
    source: "pdf",
    filename: doc.filename,
  }));

  await KnowledgeChunk.insertMany(chunkDocs);
  await KnowledgeDoc.findByIdAndUpdate(doc._id, {
    status: "ready",
    chunkCount: chunkDocs.length,
    error: "",
  });
}

// GET /api/knowledge — list all uploaded PDFs for the admin table
export async function listKnowledgeDocs(req, res) {
  const docs = await KnowledgeDoc.find()
    .sort({ createdAt: -1 })
    .populate("uploadedBy", "name email");
  res.json({ docs });
}

// DELETE /api/knowledge/:id — removes the Cloudinary file, all its
// KnowledgeChunk vectors, and the KnowledgeDoc record itself.
export async function deleteKnowledgeDoc(req, res) {
  const doc = await KnowledgeDoc.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ message: "Document not found" });
  }

  await KnowledgeChunk.deleteMany({ docId: doc._id });

  // Reuses the same URL-parsing delete helper the rest of the codebase
  // uses for faculty photos, gallery images, etc. — figures out the
  // resource type from the Cloudinary URL itself, so it stays correct
  // even though PDFs upload under resource_type "auto".
  await deleteUploadedFile(doc.cloudinaryUrl);

  await doc.deleteOne();
  res.json({ message: "Deleted", id: doc._id });
}
