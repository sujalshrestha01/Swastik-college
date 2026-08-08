import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";
import {
  uploadKnowledgePdf,
  listKnowledgeDocs,
  deleteKnowledgeDoc,
} from "../controllers/knowledgeController.js";

const router = Router();

// Separate multer instance from middleware/upload.js since this only ever
// accepts a single PDF (no images, no multi-file), with a slightly larger
// size limit since college brochures/prospectuses can be image-heavy PDFs.
const pdfUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, cb) {
    const isPdf =
      /\.pdf$/i.test(file.originalname) || file.mimetype === "application/pdf";
    if (isPdf) return cb(null, true);
    cb(new Error("Only PDF files are allowed"));
  },
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// POST /api/knowledge/upload — admin uploads a PDF to train the chat bot
router.post(
  "/upload",
  requireAuth,
  pdfUpload.single("pdf"),
  uploadKnowledgePdf,
);

// GET /api/knowledge — list uploaded PDFs (Knowledge Base Manager table)
router.get("/", requireAuth, listKnowledgeDocs);

// DELETE /api/knowledge/:id — remove a PDF and its chunks
router.delete("/:id", requireAuth, deleteKnowledgeDoc);

export default router;
