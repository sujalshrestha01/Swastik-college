import mongoose from "mongoose";

// How long chat history is kept before MongoDB auto-deletes it. 90 days is
// generous for a college admissions bot (no reasonable need to keep a
// student's chat transcript longer than a term), and keeps storage bounded
// on the 512MB free tier without any manual cleanup job. Override via env
// if you want a different retention window.
const RETENTION_DAYS = Number(process.env.CHAT_RETENTION_DAYS) || 90;
const RETENTION_SECONDS = RETENTION_DAYS * 24 * 60 * 60;

const chatMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatConversation",
      required: true,
      index: true,
    },
    sender: { type: String, enum: ["student", "bot", "admin"], required: true },
    // maxlength guards against someone pasting a huge wall of text into the
    // widget and quietly eating your storage quota one message at a time.
    text: { type: String, required: true, maxlength: 4000 },
    // For bot answers, keep which chunks were used — handy for debugging
    // "why did it say that" without re-running retrieval.
    sourceChunkIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "KnowledgeChunk" }],
  },
  { timestamps: true },
);

// TTL index: MongoDB runs a background job (roughly every 60s) that deletes
// any document whose createdAt is older than RETENTION_SECONDS. This is a
// real index option, not application code — it keeps working even if your
// server is down, and needs zero maintenance.
chatMessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: RETENTION_SECONDS });

export default mongoose.model("ChatMessage", chatMessageSchema);