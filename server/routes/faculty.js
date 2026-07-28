import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listFaculty, createFaculty, updateFaculty, deleteFaculty } from '../controllers/facultyController.js';

const router = Router();

router.get('/', listFaculty);
router.post('/', requireAuth, createFaculty);
router.put('/:id', requireAuth, updateFaculty);
router.delete('/:id', requireAuth, deleteFaculty);

export default router;
