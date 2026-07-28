import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getSettings, updateSettings, getVisibilitySchema, updateVisibility } from '../controllers/settingsController.js';

const router = Router();

router.get('/', getSettings);
router.get('/visibility-schema', requireAuth, getVisibilitySchema);
router.put('/visibility', requireAuth, updateVisibility);
router.put('/', requireAuth, updateSettings);

export default router;
