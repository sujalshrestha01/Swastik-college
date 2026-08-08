import { useEffect, useRef, useState } from "react";
import {
  Bot,
  User,
  UserCog,
  Send,
  Inbox,
  MessageCircle,
  LogOut,
  Clock,
  History,
  Mail,
  RotateCcw,
} from "lucide-react";
import { getAdminSocket } from "../../api/chatSocket";
import { getConversations, getConversationMessages } from "../../api/client";
import { Button, EmptyState, Banner } from "../../components/admin/Ui";

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(dateStr).toLocaleDateString();
}

const STATUS_LABEL = {
  BOT: "Bot-handled",
  WAITING_FOR_ADMIN: "Waiting",
  ADMIN: "With admin",
};

function ConversationRow({ conv, active, onClick, showStatus }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b border-navy-100 hover:bg-navy-50 transition-colors ${
        active ? "bg-marigold-50" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-navy-800 truncate">
          {conv.studentName || `Student · ${conv.sessionId.slice(0, 8)}`}
        </p>
        <span className="text-[11px] text-navy-400 shrink-0 flex items-center gap-1">
          <Clock size={10} /> {timeAgo(conv.lastMessageAt)}
        </span>
      </div>
      <p className="text-xs text-navy-500 truncate mt-0.5">
        {conv.lastMessagePreview || "No messages yet"}
      </p>
      <div className="flex items-center gap-2 mt-1">
        {showStatus && (
          <span className="text-[10px] font-medium text-navy-400">
            {STATUS_LABEL[conv.status] || conv.status}
          </span>
        )}
        {conv.contactEmail && (
          <span className="text-[10px] font-medium text-teal-600 flex items-center gap-1">
            <Mail size={10} /> callback requested
          </span>
        )}
      </div>
    </button>
  );
}

export default function AdminLiveChat() {
  const [tab, setTab] = useState("inbox"); // "inbox" | "history"
  const [waiting, setWaiting] = useState([]);
  const [active, setActive] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [selected, setSelected] = useState(null); // { conversation, messages, readOnly }
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const selectedIdRef = useRef(null);

  useEffect(() => {
    selectedIdRef.current = selected?.conversation?._id || null;
  }, [selected]);

  useEffect(() => {
    const socket = getAdminSocket();

    function refreshInbox() {
      socket.emit("admin:join_inbox");
    }

    function handleInboxState({ waiting, active }) {
      setWaiting(waiting || []);
      setActive(active || []);
      setConnected(true);
    }
    function handleEscalation(item) {
      setWaiting((prev) => [
        {
          _id: item.conversationId,
          sessionId: item.sessionId,
          studentName: item.studentName,
          lastMessagePreview: item.lastMessagePreview,
          lastMessageAt: new Date().toISOString(),
        },
        ...prev.filter((c) => c._id !== item.conversationId),
      ]);
    }
    function handleClaimed({ conversationId }) {
      setWaiting((prev) => prev.filter((c) => c._id !== conversationId));
    }
    function handleUpdated(item) {
      setWaiting((prev) =>
        prev.map((c) =>
          c._id === item.conversationId
            ? {
                ...c,
                lastMessagePreview:
                  item.lastMessagePreview ?? c.lastMessagePreview,
                lastMessageAt: item.lastMessageAt || c.lastMessageAt,
              }
            : c,
        ),
      );
      setActive((prev) =>
        prev.map((c) =>
          c._id === item.conversationId
            ? {
                ...c,
                lastMessagePreview:
                  item.lastMessagePreview ?? c.lastMessagePreview,
                lastMessageAt: item.lastMessageAt || c.lastMessageAt,
              }
            : c,
        ),
      );
      if (item.conversationId && !item.lastMessagePreview) {
        refreshInbox();
        if (selectedIdRef.current === item.conversationId) setSelected(null);
      }
    }
    function handleConversationState({ conversation, messages }) {
      setSelected({ conversation, messages, readOnly: false });
      setTab("inbox");
      refreshInbox();
    }
    function handleMessage(message) {
      if (selectedIdRef.current == null) return;
      if (String(message.conversationId) !== String(selectedIdRef.current))
        return;
      setSelected((prev) =>
        prev && !prev.readOnly
          ? { ...prev, messages: [...prev.messages, message] }
          : prev,
      );
    }
    function handleError({ message }) {
      setError(message);
    }
    function handleConnectError() {
      setError(
        "Couldn't connect to live chat — check your connection or log in again.",
      );
    }

    socket.on("connect", refreshInbox);
    socket.on("admin:inbox_state", handleInboxState);
    socket.on("admin:escalation", handleEscalation);
    socket.on("admin:conversation_claimed", handleClaimed);
    socket.on("admin:conversation_updated", handleUpdated);
    socket.on("admin:conversation_state", handleConversationState);
    socket.on("chat:message", handleMessage);
    socket.on("chat:error", handleError);
    socket.on("connect_error", handleConnectError);

    if (socket.connected) refreshInbox();

    return () => {
      socket.off("connect", refreshInbox);
      socket.off("admin:inbox_state", handleInboxState);
      socket.off("admin:escalation", handleEscalation);
      socket.off("admin:conversation_claimed", handleClaimed);
      socket.off("admin:conversation_updated", handleUpdated);
      socket.off("admin:conversation_state", handleConversationState);
      socket.off("chat:message", handleMessage);
      socket.off("chat:error", handleError);
      socket.off("connect_error", handleConnectError);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages]);

  async function loadHistory() {
    setHistoryLoading(true);
    try {
      const { conversations } = await getConversations();
      setHistory(conversations || []);
    } catch (err) {
      setError(err.message || "Couldn't load chat history");
    } finally {
      setHistoryLoading(false);
    }
  }

  function switchTab(next) {
    setTab(next);
    if (next === "history" && history.length === 0) loadHistory();
  }

  function openConversation(conversationId) {
    getAdminSocket().emit("admin:accept", { conversationId });
  }

  async function openHistoryConversation(conversationId) {
    setError("");
    try {
      const { conversation, messages } =
        await getConversationMessages(conversationId);
      setSelected({ conversation, messages, readOnly: true });
    } catch (err) {
      setError(err.message || "Couldn't load this conversation");
    }
  }

  function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || !selected || selected.readOnly) return;
    getAdminSocket().emit("admin:message", {
      conversationId: selected.conversation._id,
      text: input.trim(),
    });
    setInput("");
  }

  function endChat() {
    if (!selected) return;
    getAdminSocket().emit("admin:end", {
      conversationId: selected.conversation._id,
    });
    setSelected(null);
  }

  const filteredHistory = historySearch.trim()
    ? history.filter((c) =>
        [c.studentName, c.sessionId, c.lastMessagePreview, c.contactEmail]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(historySearch.trim().toLowerCase()),
      )
    : history;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-navy-800">
          Live Chat Management
        </h1>
        <p className="text-sm text-navy-500 mt-1">
          Chats where a student asked for a real person. Accept a waiting chat
          to start replying live — the bot stays quiet until you end it.
        </p>
      </div>

      {error && <Banner type="error">{error}</Banner>}

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 h-[calc(100vh-260px)] min-h-[420px]">
        {/* Inbox / History */}
        <div className="flex flex-col overflow-hidden bg-white rounded-2xl border border-navy-100 shadow-sm">
          <div className="flex border-b border-navy-100 shrink-0">
            <button
              onClick={() => switchTab("inbox")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold transition-colors ${
                tab === "inbox"
                  ? "text-navy-800 border-b-2 border-marigold-400"
                  : "text-navy-400"
              }`}
            >
              <Inbox size={15} /> Inbox
            </button>
            <button
              onClick={() => switchTab("history")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold transition-colors ${
                tab === "history"
                  ? "text-navy-800 border-b-2 border-marigold-400"
                  : "text-navy-400"
              }`}
            >
              <History size={15} /> History
            </button>
          </div>

          {tab === "inbox" ? (
            <div className="flex-1 overflow-y-auto">
              {waiting.length === 0 && active.length === 0 && connected && (
                <EmptyState text="No chats waiting right now." />
              )}
              {waiting.length > 0 && (
                <>
                  <p className="px-4 pt-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-marigold-600">
                    Waiting ({waiting.length})
                  </p>
                  {waiting.map((conv) => (
                    <ConversationRow
                      key={conv._id}
                      conv={conv}
                      active={selected?.conversation?._id === conv._id}
                      onClick={() => openConversation(conv._id)}
                    />
                  ))}
                </>
              )}
              {active.length > 0 && (
                <>
                  <p className="px-4 pt-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-teal-600">
                    Your active chats ({active.length})
                  </p>
                  {active.map((conv) => (
                    <ConversationRow
                      key={conv._id}
                      conv={conv}
                      active={selected?.conversation?._id === conv._id}
                      onClick={() => openConversation(conv._id)}
                    />
                  ))}
                </>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto flex flex-col">
              <div className="p-3 border-b border-navy-100 shrink-0">
                <input
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search by name, email, message…"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-navy-200 outline-none focus:border-marigold-300"
                />
              </div>
              {historyLoading ? (
                <p className="text-sm text-navy-400 text-center py-8">
                  Loading…
                </p>
              ) : filteredHistory.length === 0 ? (
                <EmptyState text="No past conversations found." />
              ) : (
                <div>
                  {filteredHistory.map((conv) => (
                    <ConversationRow
                      key={conv._id}
                      conv={conv}
                      active={selected?.conversation?._id === conv._id}
                      onClick={() => openHistoryConversation(conv._id)}
                      showStatus
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat panel */}
        <div className="flex flex-col overflow-hidden bg-white rounded-2xl border border-navy-100 shadow-sm">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-navy-400">
                <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a chat to start replying</p>
              </div>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-navy-100 flex items-center justify-between shrink-0 gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy-800 truncate">
                    {selected.conversation.studentName ||
                      `Student · ${selected.conversation.sessionId.slice(0, 8)}`}
                  </p>
                  {selected.conversation.contactEmail && (
                    <p className="text-xs text-teal-600 flex items-center gap-1 mt-0.5">
                      <Mail size={11} /> {selected.conversation.contactEmail}
                    </p>
                  )}
                </div>
                {selected.readOnly ? (
                  <Button
                    variant="secondary"
                    onClick={() => openConversation(selected.conversation._id)}
                  >
                    <RotateCcw size={14} /> Reopen &amp; reply
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={endChat}>
                    <LogOut size={14} /> End chat
                  </Button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-paper">
                {selected.readOnly && (
                  <p className="text-center text-[11px] text-navy-400 uppercase tracking-wide">
                    Viewing closed conversation — read only
                  </p>
                )}
                {selected.messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex gap-2 items-start ${msg.sender === "admin" ? "flex-row-reverse" : ""}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        msg.sender === "admin"
                          ? "bg-teal-400 text-white"
                          : msg.sender === "student"
                            ? "bg-navy-100 text-navy-600"
                            : "bg-marigold-100 text-marigold-700"
                      }`}
                    >
                      {msg.sender === "admin" ? (
                        <UserCog size={12} />
                      ) : msg.sender === "student" ? (
                        <User size={12} />
                      ) : (
                        <Bot size={12} />
                      )}
                    </span>
                    <p
                      className={`text-sm rounded-2xl px-3.5 py-2.5 max-w-[75%] whitespace-pre-wrap ${
                        msg.sender === "admin"
                          ? "bg-teal-500 text-white rounded-tr-sm"
                          : "bg-white border border-navy-100 text-navy-700 rounded-tl-sm"
                      }`}
                    >
                      {msg.text}
                    </p>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              {!selected.readOnly && (
                <form
                  onSubmit={sendMessage}
                  className="px-3 py-3 border-t border-navy-100 shrink-0 flex items-center gap-2"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Reply to student…"
                    className="flex-1 min-w-0 px-3.5 py-2.5 text-sm text-navy-800 placeholder:text-navy-400 bg-white rounded-full border border-navy-200 outline-none focus:border-marigold-300"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="w-10 h-10 shrink-0 rounded-full bg-marigold-400 hover:bg-marigold-300 disabled:opacity-50 text-navy-900 flex items-center justify-center transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
