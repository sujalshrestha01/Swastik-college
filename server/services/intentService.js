// Detects whether a student's message is asking to talk to a human admin.
//
// Deliberately keyword-based rather than a Gemini call on every message:
// the widget's own "Chat with admin" button already sends the exact phrase
// below, so a keyword check catches the overwhelming majority of real
// handoff requests at zero cost and zero latency. Running an LLM
// classification on every single message would silently double your Gemini
// free-tier request usage for a case a plain match already covers.
//
// If you later want to also catch indirect phrasing ("can someone actually
// help me", "is a real person there"), the natural upgrade is a single
// gemini-2.5-flash-lite classification call — but only as a fallback when
// this keyword check returns false, so normal Q&A traffic never pays for it.
const HANDOFF_PATTERNS = [
  /chat with admin/i,
  /talk to (an? )?(admin|human|person|staff|officer|counsel(l)?or)/i,
  /speak (to|with) (an? )?(admin|human|person|staff)/i,
  /real person/i,
  /human (agent|support|help)/i,
  /connect me to/i,
];

export function wantsHumanAdmin(message) {
  return HANDOFF_PATTERNS.some((pattern) => pattern.test(message));
}
