import { io } from "socket.io-client";
import { SERVER_ORIGIN, getToken } from "./client";

// ---------- Student-facing socket (public, no auth) ----------
let studentSocket = null;
export function getStudentSocket() {
  if (!studentSocket) {
    studentSocket = io(SERVER_ORIGIN, {
      transports: ["websocket", "polling"],
    });
  }
  return studentSocket;
}

// Each browser tab gets a stable random ID for the lifetime of the tab, so
// refreshing the page keeps the same conversation instead of starting a new
// one. No student login required.
const SESSION_KEY = "swastik_chat_session_id";
export function getChatSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

// ---------- Admin-facing socket (authenticated via the same JWT as the REST API) ----------
let adminSocket = null;
export function getAdminSocket() {
  if (adminSocket) return adminSocket;
  adminSocket = io(`${SERVER_ORIGIN}/admin`, {
    auth: { token: getToken() },
    transports: ["websocket", "polling"],
  });
  return adminSocket;
}
export function disconnectAdminSocket() {
  if (adminSocket) {
    adminSocket.disconnect();
    adminSocket = null;
  }
}
