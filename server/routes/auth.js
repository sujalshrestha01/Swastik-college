import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/auth.js";
import {
  login,
  getMe,
  changePassword,
  inviteAdmin,
  acceptInvite,
  forgotPassword,
  resetPassword,
  listAdmins,
  updateAdminRole,
  resendInvite,
  deleteAdmin,
} from "../controllers/authController.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many attempts — please wait 15 minutes and try again.",
  },
});

router.post("/login", authLimiter, login);
router.get("/me", requireAuth, getMe);
router.put("/password", requireAuth, changePassword);

router.post("/invite", requireAuth, inviteAdmin);
router.post("/accept-invite", authLimiter, acceptInvite);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);

router.get("/admins", requireAuth, listAdmins);
router.put("/admins/:id/role", requireAuth, updateAdminRole);
router.post("/admins/:id/resend-invite", requireAuth, resendInvite);
router.delete("/admins/:id", requireAuth, deleteAdmin);

export default router;
