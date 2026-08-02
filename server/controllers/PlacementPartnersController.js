import PlacementPartner from "../models/PlacementPartner.js";

export async function listPlacementPartners(req, res) {
  try {
    const partners = await PlacementPartner.find().sort({ order: 1 });
    res.json(partners);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Failed to fetch placement partners",
        error: err.message,
      });
  }
}

export async function createPlacementPartner(req, res) {
  try {
    const partner = await PlacementPartner.create(req.body);
    res.status(201).json(partner);
  } catch (err) {
    res
      .status(400)
      .json({
        message: "Failed to create placement partner",
        error: err.message,
      });
  }
}

export async function updatePlacementPartner(req, res) {
  try {
    const partner = await PlacementPartner.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!partner)
      return res.status(404).json({ message: "Placement partner not found" });
    res.json(partner);
  } catch (err) {
    res
      .status(400)
      .json({
        message: "Failed to update placement partner",
        error: err.message,
      });
  }
}

export async function deletePlacementPartner(req, res) {
  try {
    const partner = await PlacementPartner.findByIdAndDelete(req.params.id);
    if (!partner)
      return res.status(404).json({ message: "Placement partner not found" });
    res.json({ message: "Placement partner deleted" });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Failed to delete placement partner",
        error: err.message,
      });
  }
}
