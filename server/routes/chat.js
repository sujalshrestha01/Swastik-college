import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listConversations,
  getConversationMessages,
} from "../controllers/chatController.js";

const router = Router();

// GET /api/chat/conversations — list chats (filterable by ?status=)
router.get("/conversations", requireAuth, listConversations);

// GET /api/chat/conversations/:id/messages — full message history
router.get("/conversations/:id/messages", requireAuth, getConversationMessages);

export default router;
