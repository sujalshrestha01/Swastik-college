import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialsController.js";

const router = Router();

router.get("/", listTestimonials);
router.post("/", requireAuth, createTestimonial);
router.put("/:id", requireAuth, updateTestimonial);
router.delete("/:id", requireAuth, deleteTestimonial);

export default router;
