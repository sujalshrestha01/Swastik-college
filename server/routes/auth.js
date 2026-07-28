import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { login, getMe, changePassword, inviteAdmin, acceptInvite } from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.get('/me', requireAuth, getMe);
router.put('/password', requireAuth, changePassword);
router.post('/invite', requireAuth, inviteAdmin);
router.post('/accept-invite', acceptInvite);

export default router;
