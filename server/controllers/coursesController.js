import Course from "../models/Course.js";

export async function listCourses(req, res) {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: { $ne: false } };
    const courses = await Course.find(filter).sort({ order: 1, name: 1 });
    res.json(courses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch courses", error: err.message });
  }
}

export async function getCourse(req, res) {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch course", error: err.message });
  }
}

export async function createCourse(req, res) {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message:
          "A course with this slug already exists. Please choose a different URL slug.",
        error: err.message,
      });
    }
    res
      .status(400)
      .json({ message: "Failed to create course", error: err.message });
  }
}

export async function updateCourse(req, res) {
  try {
    const course = await Course.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update course", error: err.message });
  }
}

export async function deleteCourse(req, res) {
  try {
    const course = await Course.findOneAndDelete({ slug: req.params.slug });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete course", error: err.message });
  }
}
