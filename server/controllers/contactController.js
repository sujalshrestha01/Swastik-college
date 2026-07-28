import ContactMessage from '../models/ContactMessage.js';

export async function submitInquiry(req, res) {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }
    const entry = await ContactMessage.create(req.body);
    res.status(201).json({ message: 'Inquiry received', id: entry._id });
  } catch (err) {
    res.status(400).json({ message: 'Failed to submit inquiry', error: err.message });
  }
}

export async function listInquiries(req, res) {
  try {
    const entries = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch inquiries', error: err.message });
  }
}

export async function markInquiryRead(req, res) {
  try {
    const entry = await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!entry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update inquiry', error: err.message });
  }
}

export async function deleteInquiry(req, res) {
  try {
    const entry = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json({ message: 'Inquiry deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete inquiry', error: err.message });
  }
}
