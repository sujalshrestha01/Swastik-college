import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listFaqs, createFaq, updateFaq, deleteFaq } from '../controllers/faqController.js';

const router = Router();

router.get('/', listFaqs);
router.post('/', requireAuth, createFaq);
router.put('/:id', requireAuth, updateFaq);
router.delete('/:id', requireAuth, deleteFaq);

export default router;
