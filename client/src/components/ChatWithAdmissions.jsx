import { useEffect, useState } from "react";
import {
  MessageCircle,
  X,
  Send,
  ArrowLeft,
  CheckCircle2,
  Bot,
  User,
} from "lucide-react";
import { getFaqs, submitContactForm } from "../api/client";

/**
 * "Chat with Admissions" widget.
 *
 * Step 1: shows a list of FAQ questions (admin-managed via /admin/faq).
 * Step 2: tapping a question instantly shows its stored answer — this is
 *         answered entirely by the FAQ content, no admin/human involved.
 * Step 3: "Still need help?" drops into a short message form that goes to
 *         the same Inquiries inbox as the Contact page.
 *
 * Extension point for later: swap `answerFor(faq)` (or add a new branch in
 * handleAsk) to call an AI endpoint instead of/in addition to the stored
 * FAQ answer once that's ready — the chat-bubble UI here doesn't need to
 * change.
 */
export default function ChatWithAdmissions({ onClose }) {
  const [faqs, setFaqs] = useState([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const [thread, setThread] = useState([]); // { role: 'bot' | 'user', text }
  const [mode, setMode] = useState("faq"); // 'faq' | 'form'
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState("idle"); // idle | sending | sent

  useEffect(() => {
    getFaqs().then((data) => {
      setFaqs(data || []);
      setLoadingFaqs(false);
    });
  }, []);

  function handleAsk(faq) {
    setThread((prev) => [
      ...prev,
      { role: "user", text: faq.question },
      { role: "bot", text: faq.answer },
    ]);
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    setFormStatus("sending");
    await submitContactForm({
      ...form,
      message: `[Live chat] ${form.message}`,
    });
    setFormStatus("sent");
  }

  return (
    <div className="w-[92vw] max-w-sm bg-white dark:bg-navy-800 rounded-2xl shadow-2xl border border-navy-100 dark:border-navy-700 flex flex-col overflow-hidden max-h-[70vh]">
      {/* Header */}
      <div className="bg-navy-800 dark:bg-navy-900 text-white px-4 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-marigold-400 text-navy-900 flex items-center justify-center">
            <Bot size={16} />
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight">
              Admissions Assistant
            </p>
            <p className="text-[11px] text-navy-300 leading-tight">
              Usually answers instantly
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-navy-300 hover:text-white">
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-paper dark:bg-navy-900/40">
        {mode === "faq" ? (
          <>
            <div className="flex gap-2 items-start">
              <span className="w-6 h-6 rounded-full bg-navy-100 dark:bg-navy-700 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={12} className="text-navy-500" />
              </span>
              <p className="text-sm bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-navy-700 dark:text-navy-100">
                Hi! Tap a question below for an instant answer, or message
                admissions directly if you don't see what you need.
              </p>
            </div>

            {thread.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    msg.role === "user"
                      ? "bg-marigold-400 text-navy-900"
                      : "bg-navy-100 dark:bg-navy-700 text-navy-500"
                  }`}
                >
                  {msg.role === "user" ? <User size={12} /> : <Bot size={12} />}
                </span>
                <p
                  className={`text-sm rounded-2xl px-3.5 py-2.5 max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-marigold-400 text-navy-900 rounded-tr-sm"
                      : "bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700 text-navy-700 dark:text-navy-100 rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </p>
              </div>
            ))}

            {loadingFaqs ? (
              <p className="text-xs text-navy-400 text-center py-4">
                Loading questions…
              </p>
            ) : faqs.length === 0 ? (
              <p className="text-xs text-navy-400 text-center py-4">
                No FAQs added yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {faqs.map((f) => (
                  <button
                    key={f._id}
                    onClick={() => handleAsk(f)}
                    className="text-xs font-medium bg-white dark:bg-navy-800 border border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300 px-3 py-1.5 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors"
                  >
                    {f.question}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : formStatus === "sent" ? (
          <div className="text-center py-6">
            <CheckCircle2
              className="mx-auto text-teal-600 dark:text-teal-400 mb-2"
              size={30}
            />
            <p className="text-sm font-semibold text-navy-800 dark:text-paper">
              Message sent!
            </p>
            <p className="text-xs text-navy-400 mt-1">
              Admissions will follow up by email soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-3">
            <button
              type="button"
              onClick={() => setMode("faq")}
              className="text-xs text-navy-400 hover:text-navy-600 inline-flex items-center gap-1 mb-1"
            >
              <ArrowLeft size={12} /> Back to questions
            </button>
            <input
              required
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-navy-100 dark:border-navy-700 bg-white dark:bg-navy-800 outline-none focus:border-marigold-300"
            />
            <input
              required
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-navy-100 dark:border-navy-700 bg-white dark:bg-navy-800 outline-none focus:border-marigold-300"
            />
            <textarea
              required
              rows={3}
              placeholder="What would you like to ask?"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-navy-100 dark:border-navy-700 bg-white dark:bg-navy-800 outline-none focus:border-marigold-300 resize-none"
            />
            <button
              type="submit"
              disabled={formStatus === "sending"}
              className="w-full inline-flex items-center justify-center gap-2 bg-marigold hover:bg-marigold-500 disabled:opacity-60 text-navy-900 font-semibold text-sm px-4 py-2.5 rounded-full transition-colors"
            >
              {formStatus === "sending" ? (
                "Sending…"
              ) : (
                <>
                  <Send size={14} /> Send to Admissions
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Footer action */}
      {mode === "faq" && (
        <div className="px-4 py-3 border-t border-navy-100 dark:border-navy-700 shrink-0">
          <button
            onClick={() => setMode("form")}
            className="w-full text-sm font-medium text-navy-700 dark:text-navy-100 bg-navy-50 dark:bg-navy-800 hover:bg-navy-100 dark:hover:bg-navy-700 rounded-full py-2.5 flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle size={15} /> Still need help? Message admissions
          </button>
        </div>
      )}
    </div>
  );
}
