import Download from "../models/Download.js";

export async function listDownloads(req, res) {
  try {
    const downloads = await Download.find().sort({ order: 1, createdAt: -1 });
    res.json(downloads);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch downloads", error: err.message });
  }
}

export async function getDownload(req, res) {
  try {
    const item = await Download.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Download not found" });
    res.json(item);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch download", error: err.message });
  }
}

export async function createDownload(req, res) {
  try {
    const item = await Download.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create download", error: err.message });
  }
}

export async function updateDownload(req, res) {
  try {
    const item = await Download.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Download not found" });
    res.json(item);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update download", error: err.message });
  }
}

export async function deleteDownload(req, res) {
  try {
    const item = await Download.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Download not found" });
    res.json({ message: "Download deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete download", error: err.message });
  }
}
