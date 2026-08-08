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

// Each browser gets a stable random ID that persists across tab closes and
// browser restarts (localStorage, not sessionStorage) — so a student who
// accidentally closes the tab mid-conversation with an admin doesn't lose
// their thread. They can still start fresh via resetChatSession() (wired to
// a "New conversation" button in the widget).
const SESSION_KEY = "swastik_chat_session_id";
export function getChatSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}
export function resetChatSession() {
  const id = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, id);
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
