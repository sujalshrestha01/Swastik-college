import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/coursesController.js";

const router = Router();

router.get("/", listCourses);
router.get("/:slug", getCourse);
router.post("/", requireAuth, createCourse);
router.put("/:slug", requireAuth, updateCourse);
router.delete("/:slug", requireAuth, deleteCourse);

export default router;
