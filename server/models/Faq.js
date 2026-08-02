import mongoose from "mongoose";

// FAQ entries shown in the public "Chat with Admissions" quick-action
// widget. Clicking a question shows this canned answer instantly — no
// admin/human involvement needed. Kept intentionally simple (question +
// answer + order) so it's easy to swap in an AI-generated answer later
// without changing the schema.
const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Faq", faqSchema);
