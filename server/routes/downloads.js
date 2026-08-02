import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listDownloads,
  getDownload,
  createDownload,
  updateDownload,
  deleteDownload,
} from "../controllers/downloadsController.js";

const router = Router();

router.get("/", listDownloads);
router.get("/:id", getDownload);
router.post("/", requireAuth, createDownload);
router.put("/:id", requireAuth, updateDownload);
router.delete("/:id", requireAuth, deleteDownload);

export default router;
