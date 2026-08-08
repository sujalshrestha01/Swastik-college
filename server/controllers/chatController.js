import ChatConversation from "../models/ChatConversation.js";
import ChatMessage from "../models/ChatMessage.js";

// GET /api/chat/conversations?status=WAITING_FOR_ADMIN — powers the admin
// Live Chat Management inbox list. Omit ?status to get everything.
export async function listConversations(req, res) {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const conversations = await ChatConversation.find(filter)
    .sort({ lastMessageAt: -1 })
    .limit(100)
    .populate("assignedAdmin", "name email");

  res.json({ conversations });
}

// GET /api/chat/conversations/:id/messages — full history for one chat,
// shown when an admin opens a conversation.
export async function getConversationMessages(req, res) {
  const conversation = await ChatConversation.findById(req.params.id);
  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }

  const messages = await ChatMessage.find({ conversationId: conversation._id })
    .sort({ createdAt: 1 })
    .limit(500);

  res.json({ conversation, messages });
}
