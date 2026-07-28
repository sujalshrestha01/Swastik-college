import mongoose from 'mongoose';

// Certification / non-credit skill courses shown on the "Non-Credit Courses"
// page — informational only (no enrollment link), fully editable from admin.
const skillCourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    logoUrl: { type: String, default: '' },
    duration: { type: String, default: '' },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('SkillCourse', skillCourseSchema);
