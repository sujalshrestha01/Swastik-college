import { Router } from 'express';
import SiteSettings from '../models/SiteSettings.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne({ key: 'main' });
  if (!settings) settings = await SiteSettings.create({ key: 'main' });
  return settings;
}

// GET /api/settings — public, powers the whole site (footer, hero, social links, stats...)
router.get('/', async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch settings', error: err.message });
  }
});

// PUT /api/settings — admin only, updates any field(s): social links, contact info,
// hero text, stats, footer note, literally every configurable detail.
router.put('/', requireAuth, async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    Object.assign(settings, req.body, { key: 'main' });
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update settings', error: err.message });
  }
});

export default router;
