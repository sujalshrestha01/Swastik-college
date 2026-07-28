import Faculty from '../models/Faculty.js';

export async function listFaculty(req, res) {
  try {
    const faculty = await Faculty.find().sort({ order: 1, name: 1 });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch faculty', error: err.message });
  }
}

export async function createFaculty(req, res) {
  try {
    const member = await Faculty.create(req.body);
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create faculty member', error: err.message });
  }
}

export async function updateFaculty(req, res) {
  try {
    const member = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) return res.status(404).json({ message: 'Faculty member not found' });
    res.json(member);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update faculty member', error: err.message });
  }
}

export async function deleteFaculty(req, res) {
  try {
    const member = await Faculty.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Faculty member not found' });
    res.json({ message: 'Faculty member deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete faculty member', error: err.message });
  }
}
