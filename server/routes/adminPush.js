import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  vapidPublicKey,
  subscribe,
  unsubscribe,
  updatePreferences,
} from "../controllers/pushController.js";

const router = Router();

router.get("/vapid-public-key", vapidPublicKey);
router.post("/subscribe", requireAuth, subscribe);
router.post("/unsubscribe", requireAuth, unsubscribe);
router.put("/preferences", requireAuth, updatePreferences);

export default router;
