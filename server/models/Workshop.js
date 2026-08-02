import mongoose from "mongoose";

// Live / bootcamp-style workshops. No seat-count field by design — the
// public page just shows "Enrollment Open" and links out to an
// admin-provided enrollment form (e.g. a Google Form) instead of tracking
// live seat numbers.
const workshopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    logoUrl: { type: String, default: "" },
    duration: { type: String, default: "" },
    startDate: { type: Date },
    status: { type: String, default: "Enrollment Open" },
    type: { type: String, default: "Workshop" },
    description: { type: String, default: "" },
    highlights: { type: [String], default: [] },
    // The admin-editable enrollment link — typically a Google Form URL.
    enrollUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Workshop", workshopSchema);
