import GalleryEvent from "../models/Gallery.js";

// GET /api/gallery — public
export async function listGalleryEvents(req, res) {
  try {
    const events = await GalleryEvent.find().sort({
      order: 1,
      date: -1,
      createdAt: -1,
    });
    res.json(events);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch gallery events", error: err.message });
  }
}

// GET /api/gallery/:id — public, single event with all images
export async function getGalleryEvent(req, res) {
  try {
    const event = await GalleryEvent.findById(req.params.id);
    if (!event)
      return res.status(404).json({ message: "Gallery event not found" });
    res.json(event);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch gallery event", error: err.message });
  }
}

// POST /api/gallery — admin only
// Body: { title, description, category, date, images: [{url, caption}], thumbnailId }
export async function createGalleryEvent(req, res) {
  try {
    const { images } = req.body;
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }
    const event = await GalleryEvent.create(req.body);
    // Default the thumbnail to the first image if none was chosen explicitly.
    if (!event.thumbnailId && event.images.length > 0) {
      event.thumbnailId = String(event.images[0]._id);
      await event.save();
    }
    res.status(201).json(event);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create gallery event", error: err.message });
  }
}

// PUT /api/gallery/:id — admin only
export async function updateGalleryEvent(req, res) {
  try {
    const event = await GalleryEvent.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!event)
      return res.status(404).json({ message: "Gallery event not found" });
    res.json(event);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update gallery event", error: err.message });
  }
}

// DELETE /api/gallery/:id — admin only
export async function deleteGalleryEvent(req, res) {
  try {
    const event = await GalleryEvent.findByIdAndDelete(req.params.id);
    if (!event)
      return res.status(404).json({ message: "Gallery event not found" });
    res.json({ message: "Gallery event deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete gallery event", error: err.message });
  }
}
