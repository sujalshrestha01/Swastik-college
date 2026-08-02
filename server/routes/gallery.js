import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listGalleryEvents,
  getGalleryEvent,
  createGalleryEvent,
  updateGalleryEvent,
  deleteGalleryEvent,
} from "../controllers/galleryController.js";

const router = Router();

router.get("/", listGalleryEvents);
router.get("/:id", getGalleryEvent);
router.post("/", requireAuth, createGalleryEvent);
router.put("/:id", requireAuth, updateGalleryEvent);
router.delete("/:id", requireAuth, deleteGalleryEvent);

export default router;
