import Workshop from '../models/Workshop.js';

export async function listWorkshops(req, res) {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: { $ne: false } };
    const workshops = await Workshop.find(filter).sort({ order: 1, startDate: 1 });
    res.json(workshops);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch workshops', error: err.message });
  }
}

export async function createWorkshop(req, res) {
  try {
    const workshop = await Workshop.create(req.body);
    res.status(201).json(workshop);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create workshop', error: err.message });
  }
}

export async function updateWorkshop(req, res) {
  try {
    const workshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
    res.json(workshop);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update workshop', error: err.message });
  }
}

export async function deleteWorkshop(req, res) {
  try {
    const workshop = await Workshop.findByIdAndDelete(req.params.id);
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
    res.json({ message: 'Workshop deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete workshop', error: err.message });
  }
}
