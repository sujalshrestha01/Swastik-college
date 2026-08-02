import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";

const router = Router();

router.get("/", listBlogs);
router.get("/:identifier", getBlog);
router.post("/", requireAuth, createBlog);
router.put("/:id", requireAuth, updateBlog);
router.delete("/:id", requireAuth, deleteBlog);

export default router;
