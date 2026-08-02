import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  submitInquiry,
  listInquiries,
  markInquiryRead,
  deleteInquiry,
} from "../controllers/contactController.js";

const router = Router();

router.post("/", submitInquiry);
router.get("/", requireAuth, listInquiries);
router.patch("/:id/read", requireAuth, markInquiryRead);
router.delete("/:id", requireAuth, deleteInquiry);

export default router;
