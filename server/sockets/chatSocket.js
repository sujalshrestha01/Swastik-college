import jwt from "jsonwebtoken";
import ChatConversation from "../models/ChatConversation.js";
import ChatMessage from "../models/ChatMessage.js";
import { answerStudentQuestion } from "../services/ragService.js";
import { wantsHumanAdmin } from "../services/intentService.js";

const ADMIN_INBOX_ROOM = "admin:inbox";
const HOLDING_MESSAGE =
  "Connecting you to an admission officer — someone will be with you shortly.";

function conversationRoom(sessionId) {
  return `conv:${sessionId}`;
}

// Socket.io rooms are scoped per namespace — a student (default "/"
// namespace) and an admin (in the "/admin" namespace) who both "joined"
// room "conv:xyz" are actually in two separate rooms that happen to share a
// name. `io.to(room).emit(...)` alone only reaches the student side. This
// helper emits to both namespaces' copies of the room so the message/status
// event reaches whichever side (or both) is currently connected to it.
function broadcastToConversation(io, adminNsp, sessionId, event, payload) {
  const room = conversationRoom(sessionId);
  io.to(room).emit(event, payload);
  adminNsp.to(room).emit(event, payload);
}

async function saveMessage(conversationId, sender, text, sourceChunkIds = []) {
  const message = await ChatMessage.create({
    conversationId,
    sender,
    text,
    sourceChunkIds,
  });
  await ChatConversation.findByIdAndUpdate(conversationId, {
    lastMessageAt: new Date(),
    lastMessagePreview: text.slice(0, 140),
  });
  return message;
}

export function initChatSocket(io) {
  // Two logical groups sharing one server: students connect to "/" with no
  // auth (public chat widget), admins connect to "/admin" and must present
  // a valid JWT (the same one the REST API uses) in the handshake.
  const adminNsp = io.of("/admin");

  adminNsp.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET || "dev_secret_change_me",
      );
      socket.admin = payload;
      next();
    } catch (err) {
      next(new Error("Invalid or expired session"));
    }
  });

  // ---------- Student-facing namespace (public) ----------
  io.on("connection", (socket) => {
    socket.on("student:join", async ({ sessionId, studentName }) => {
      if (!sessionId) return;
      try {
        let conversation = await ChatConversation.findOne({ sessionId });
        if (!conversation) {
          conversation = await ChatConversation.create({
            sessionId,
            studentName: studentName || "",
          });
        }
        socket.join(conversationRoom(sessionId));
        socket.data.sessionId = sessionId;
        socket.data.conversationId = String(conversation._id);

        const messages = await ChatMessage.find({
          conversationId: conversation._id,
        })
          .sort({ createdAt: 1 })
          .limit(200);

        socket.emit("conversation:state", {
          status: conversation.status,
          messages,
        });
      } catch (err) {
        socket.emit("chat:error", {
          message: "Couldn't start chat. Please refresh and try again.",
        });
      }
    });

    socket.on("student:message", async ({ sessionId, text }) => {
      if (!sessionId || !text?.trim()) return;

      try {
        const conversation = await ChatConversation.findOne({ sessionId });
        if (!conversation) {
          return socket.emit("chat:error", {
            message: "Chat session not found — please refresh.",
          });
        }

        const studentMessage = await saveMessage(
          conversation._id,
          "student",
          text.trim(),
        );
        broadcastToConversation(
          io,
          adminNsp,
          sessionId,
          "chat:message",
          studentMessage,
        );
        // Let admins watching the inbox see activity on waiting/active chats too.
        adminNsp.to(ADMIN_INBOX_ROOM).emit("admin:conversation_updated", {
          conversationId: conversation._id,
          lastMessagePreview: studentMessage.text.slice(0, 140),
          lastMessageAt: studentMessage.createdAt,
        });

        if (
          conversation.status === "ADMIN" ||
          conversation.status === "WAITING_FOR_ADMIN"
        ) {
          // A human is (or will be) handling this — the bot stays silent.
          return;
        }

        // BOT mode: check for a handoff request first (free, instant),
        // otherwise answer via RAG.
        if (wantsHumanAdmin(text)) {
          conversation.status = "WAITING_FOR_ADMIN";
          await conversation.save();

          const holdingMessage = await saveMessage(
            conversation._id,
            "bot",
            HOLDING_MESSAGE,
          );
          broadcastToConversation(
            io,
            adminNsp,
            sessionId,
            "chat:message",
            holdingMessage,
          );
          broadcastToConversation(
            io,
            adminNsp,
            sessionId,
            "conversation:status",
            { status: "WAITING_FOR_ADMIN" },
          );

          adminNsp.to(ADMIN_INBOX_ROOM).emit("admin:escalation", {
            conversationId: conversation._id,
            sessionId: conversation.sessionId,
            studentName: conversation.studentName,
            lastMessagePreview: studentMessage.text.slice(0, 140),
          });
          return;
        }

        const { answer, usedChunkIds } = await answerStudentQuestion(
          text.trim(),
        );
        const botMessage = await saveMessage(
          conversation._id,
          "bot",
          answer,
          usedChunkIds,
        );
        broadcastToConversation(
          io,
          adminNsp,
          sessionId,
          "chat:message",
          botMessage,
        );
      } catch (err) {
        console.error("student:message error:", err);
        socket.emit("chat:error", {
          message:
            err?.userMessage ||
            "Something went wrong answering that — please try again.",
        });
      }
    });
  });

  // ---------- Admin-facing namespace (authenticated) ----------
  adminNsp.on("connection", (socket) => {
    socket.join(ADMIN_INBOX_ROOM);

    socket.on("admin:join_inbox", async () => {
      const waiting = await ChatConversation.find({
        status: "WAITING_FOR_ADMIN",
      })
        .sort({ lastMessageAt: -1 })
        .limit(50);
      const active = await ChatConversation.find({
        status: "ADMIN",
        assignedAdmin: socket.admin.id,
      }).sort({ lastMessageAt: -1 });
      socket.emit("admin:inbox_state", { waiting, active });
    });

    socket.on("admin:accept", async ({ conversationId }) => {
      try {
        const conversation = await ChatConversation.findById(conversationId);
        if (!conversation) return;

        conversation.status = "ADMIN";
        conversation.assignedAdmin = socket.admin.id;
        await conversation.save();

        socket.join(conversationRoom(conversation.sessionId));

        const messages = await ChatMessage.find({
          conversationId: conversation._id,
        })
          .sort({ createdAt: 1 })
          .limit(200);
        socket.emit("admin:conversation_state", { conversation, messages });

        io.to(conversationRoom(conversation.sessionId)).emit(
          "conversation:status",
          {
            status: "ADMIN",
          },
        );
        adminNsp
          .to(conversationRoom(conversation.sessionId))
          .emit("conversation:status", {
            status: "ADMIN",
          });
        adminNsp.to(ADMIN_INBOX_ROOM).emit("admin:conversation_claimed", {
          conversationId: conversation._id,
        });
      } catch (err) {
        socket.emit("chat:error", { message: "Couldn't accept this chat." });
      }
    });

    socket.on("admin:message", async ({ conversationId, text }) => {
      if (!text?.trim()) return;
      try {
        const conversation = await ChatConversation.findById(conversationId);
        if (!conversation || conversation.status !== "ADMIN") return;
        if (String(conversation.assignedAdmin) !== String(socket.admin.id))
          return;

        const message = await saveMessage(
          conversation._id,
          "admin",
          text.trim(),
        );
        broadcastToConversation(
          io,
          adminNsp,
          conversation.sessionId,
          "chat:message",
          message,
        );
      } catch (err) {
        socket.emit("chat:error", { message: "Message failed to send." });
      }
    });

    socket.on("admin:end", async ({ conversationId }) => {
      try {
        const conversation = await ChatConversation.findById(conversationId);
        if (!conversation) return;

        conversation.status = "BOT";
        conversation.assignedAdmin = undefined;
        await conversation.save();

        socket.leave(conversationRoom(conversation.sessionId));
        broadcastToConversation(
          io,
          adminNsp,
          conversation.sessionId,
          "conversation:status",
          {
            status: "BOT",
          },
        );
        adminNsp.to(ADMIN_INBOX_ROOM).emit("admin:conversation_updated", {
          conversationId: conversation._id,
        });
      } catch (err) {
        socket.emit("chat:error", { message: "Couldn't end this chat." });
      }
    });
  });
}
