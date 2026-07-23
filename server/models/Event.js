import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    date: { type: Date, required: true },
    location: { type: String, default: 'Main Campus' },
    imageUrl: { type: String, default: '' },
    type: { type: String, enum: ['Event', 'Workshop', 'Seminar', 'Fest', 'Other'], default: 'Event' },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
