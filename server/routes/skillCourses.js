import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listSkillCourses,
  createSkillCourse,
  updateSkillCourse,
  deleteSkillCourse,
} from "../controllers/skillCoursesController.js";

const router = Router();

router.get("/", listSkillCourses);
router.post("/", requireAuth, createSkillCourse);
router.put("/:id", requireAuth, updateSkillCourse);
router.delete("/:id", requireAuth, deleteSkillCourse);

export default router;
