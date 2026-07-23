import { Router } from 'express';
import Notice from '../models/Notice.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/notices?category=Exams&search=routine — public
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const notices = await Notice.find(filter).sort({ date: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notices', error: err.message });
  }
});

// GET /api/notices/:id — public
router.get('/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json(notice);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notice', error: err.message });
  }
});

// POST /api/notices — admin only
router.post('/', requireAuth, async (req, res) => {
  try {
    const notice = await Notice.create(req.body);
    res.status(201).json(notice);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create notice', error: err.message });
  }
});

// PUT /api/notices/:id — admin only
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json(notice);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update notice', error: err.message });
  }
});

// DELETE /api/notices/:id — admin only
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json({ message: 'Notice deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete notice', error: err.message });
  }
});

export default router;
