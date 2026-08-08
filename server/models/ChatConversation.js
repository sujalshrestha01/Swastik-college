import mongoose from "mongoose";

// Slightly longer than ChatMessage's retention, so a conversation's shell
// (and its status/assignedAdmin) outlives its messages by a small buffer
// rather than expiring at the exact same instant.
const RETENTION_DAYS = (Number(process.env.CHAT_RETENTION_DAYS) || 90) + 7;
const RETENTION_SECONDS = RETENTION_DAYS * 24 * 60 * 60;

// One document per student chat session (a browser tab's chat widget
// instance). `sessionId` is a random ID the widget generates and stores in
// its own memory/localStorage — no student login is required.
const chatConversationSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: ["BOT", "WAITING_FOR_ADMIN", "ADMIN"],
      default: "BOT",
    },
    studentName: { type: String, default: "" },
    assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    lastMessageAt: { type: Date, default: Date.now },
    lastMessagePreview: { type: String, default: "" },
    // Set true right after a "no admin available" timeout fires, so the
    // very next student message gets checked for an email address instead
    // of going straight through the normal bot Q&A flow.
    awaitingContactEmail: { type: Boolean, default: false },
    // Captured once a student leaves an email for a callback when no admin
    // was available in time. Surfaced in the admin History view.
    contactEmail: { type: String, default: "" },
  },
  { timestamps: true },
);

chatConversationSchema.index(
  { lastMessageAt: 1 },
  { expireAfterSeconds: RETENTION_SECONDS },
);

export default mongoose.model("ChatConversation", chatConversationSchema);