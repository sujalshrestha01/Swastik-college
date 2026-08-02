import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  uploadSingle,
  uploadMultiple,
} from "../controllers/uploadController.js";

const router = Router();

// POST /api/upload — single image (e.g. faculty photo, hero image, testimonial photo)
router.post("/", requireAuth, upload.single("image"), uploadSingle);

// POST /api/upload/multiple — multiple images (e.g. gallery event photos)
router.post(
  "/multiple",
  requireAuth,
  upload.array("images", 20),
  uploadMultiple,
);

export default router;
