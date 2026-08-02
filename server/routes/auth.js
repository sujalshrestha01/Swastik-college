import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../middleware/auth.js';
import { login, getMe, changePassword, inviteAdmin, acceptInvite } from '../controllers/authController.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts — please wait 15 minutes and try again.' },
});

router.post('/login', authLimiter, login);
router.get('/me', requireAuth, getMe);
router.put('/password', requireAuth, changePassword);
router.post('/invite', requireAuth, inviteAdmin);
router.post('/accept-invite', authLimiter, acceptInvite);

export default router;