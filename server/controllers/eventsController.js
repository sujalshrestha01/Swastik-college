import Event from "../models/Event.js";
import {
  updateWithFileCleanup,
  deleteWithFileCleanup,
} from "../utils/fileCleanup.js";

export async function listEvents(req, res) {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch events", error: err.message });
  }
}

export async function createEvent(req, res) {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create event", error: err.message });
  }
}

export async function updateEvent(req, res) {
  try {
    const event = await updateWithFileCleanup(Event, req.params.id, req.body, [
      "imageUrl",
    ]);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update event", error: err.message });
  }
}

export async function deleteEvent(req, res) {
  try {
    const event = await deleteWithFileCleanup(Event, req.params.id, [
      "imageUrl",
    ]);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete event", error: err.message });
  }
}
