import Faq from "../models/Faq.js";

// GET /api/faqs — public. Powers the "Chat with Admissions" quick-answer
// widget: the visitor picks a question and instantly sees this stored
// answer, no admin/human involved.
export async function listFaqs(req, res) {
  try {
    const faqs = await Faq.find().sort({ order: 1, createdAt: 1 });
    res.json(faqs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch FAQs", error: err.message });
  }
}

export async function createFaq(req, res) {
  try {
    const faq = await Faq.create(req.body);
    res.status(201).json(faq);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create FAQ", error: err.message });
  }
}

export async function updateFaq(req, res) {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json(faq);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update FAQ", error: err.message });
  }
}

export async function deleteFaq(req, res) {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json({ message: "FAQ deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete FAQ", error: err.message });
  }
}
