import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listNotices, getNotice, createNotice, updateNotice, deleteNotice } from '../controllers/noticesController.js';

const router = Router();

router.get('/', listNotices);
router.get('/:id', getNotice);
router.post('/', requireAuth, createNotice);
router.put('/:id', requireAuth, updateNotice);
router.delete('/:id', requireAuth, deleteNotice);

export default router;
