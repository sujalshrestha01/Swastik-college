import SkillCourse from "../models/SkillCourse.js";
import {
  updateWithFileCleanup,
  deleteWithFileCleanup,
} from "../utils/fileCleanup.js";

export async function listSkillCourses(req, res) {
  try {
    const courses = await SkillCourse.find().sort({ order: 1, createdAt: 1 });
    res.json(courses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch skill courses", error: err.message });
  }
}

export async function createSkillCourse(req, res) {
  try {
    const course = await SkillCourse.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create skill course", error: err.message });
  }
}

export async function updateSkillCourse(req, res) {
  try {
    const course = await updateWithFileCleanup(
      SkillCourse,
      req.params.id,
      req.body,
      ["logoUrl"],
    );
    if (!course)
      return res.status(404).json({ message: "Skill course not found" });
    res.json(course);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update skill course", error: err.message });
  }
}

export async function deleteSkillCourse(req, res) {
  try {
    const course = await deleteWithFileCleanup(SkillCourse, req.params.id, [
      "logoUrl",
    ]);
    if (!course)
      return res.status(404).json({ message: "Skill course not found" });
    res.json({ message: "Skill course deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete skill course", error: err.message });
  }
}
