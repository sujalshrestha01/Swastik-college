import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listWorkshops, createWorkshop, updateWorkshop, deleteWorkshop } from '../controllers/workshopsController.js';

const router = Router();

router.get('/', listWorkshops);
router.post('/', requireAuth, createWorkshop);
router.put('/:id', requireAuth, updateWorkshop);
router.delete('/:id', requireAuth, deleteWorkshop);

export default router;
