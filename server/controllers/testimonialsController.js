import Testimonial from "../models/Testimonial.js";

export async function listTestimonials(req, res) {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1 });
    res.json(testimonials);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch testimonials", error: err.message });
  }
}

export async function createTestimonial(req, res) {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(testimonial);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create testimonial", error: err.message });
  }
}

export async function updateTestimonial(req, res) {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!testimonial)
      return res.status(404).json({ message: "Testimonial not found" });
    res.json(testimonial);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update testimonial", error: err.message });
  }
}

export async function deleteTestimonial(req, res) {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial)
      return res.status(404).json({ message: "Testimonial not found" });
    res.json({ message: "Testimonial deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete testimonial", error: err.message });
  }
}
