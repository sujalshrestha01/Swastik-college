import { Router } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function signToken(admin) {
  return jwt.sign(
    { id: admin._id, email: admin.email, name: admin.name, role: admin.role },
    process.env.JWT_SECRET || 'dev_secret_change_me',
    { expiresIn: '12h' }
  );
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) return res.status(401).json({ message: 'Invalid email or password' });

    const valid = await admin.comparePassword(password);
    if (!valid) return res.status(401).json({ message: 'Invalid email or password' });

    const token = signToken(admin);
    res.json({
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// GET /api/auth/me — verify current session & refresh admin info
router.get('/me', requireAuth, async (req, res) => {
  const admin = await Admin.findById(req.admin.id).select('-password');
  if (!admin) return res.status(404).json({ message: 'Admin not found' });
  res.json({ admin });
});

// PUT /api/auth/password — change own password
router.put('/password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const valid = await admin.comparePassword(currentPassword);
    if (!valid) return res.status(401).json({ message: 'Current password is incorrect' });

    admin.password = newPassword;
    await admin.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to update password', error: err.message });
  }
});

export default router;
