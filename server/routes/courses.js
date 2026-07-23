import { Router } from 'express';
import Course from '../models/Course.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/courses — public. Admin panel passes ?all=true to include inactive courses.
router.get('/', async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: { $ne: false } };
    const courses = await Course.find(filter).sort({ order: 1, name: 1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch courses', error: err.message });
  }
});

// GET /api/courses/:slug
router.get('/:slug', async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch course', error: err.message });
  }
});

// POST /api/courses — admin only
router.post('/', requireAuth, async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create course', error: err.message });
  }
});

// PUT /api/courses/:slug — admin only
router.put('/:slug', requireAuth, async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate({ slug: req.params.slug }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update course', error: err.message });
  }
});

// DELETE /api/courses/:slug — admin only
router.delete('/:slug', requireAuth, async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({ slug: req.params.slug });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete course', error: err.message });
  }
});

export default router;
