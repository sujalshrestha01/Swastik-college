import mongoose from 'mongoose';

// Multiple downloadable resources shown in the navbar "Downloads" dropdown —
// e.g. Model Question, Past Question, Prospectus, Fee Structure. Each item is
// a single PDF or image file with a title and an optional category.
const downloadSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      default: 'General',
      enum: ['Model Question', 'Past Question', 'Syllabus', 'Notice', 'Form', 'General'],
    },
    fileUrl: { type: String, required: true },
    order: { type: Number, default: 0 }, // lower shows first
  },
  { timestamps: true }
);

export default mongoose.model('Download', downloadSchema);
