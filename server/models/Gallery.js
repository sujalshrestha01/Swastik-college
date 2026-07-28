import mongoose from 'mongoose';

// A single gallery "event" can hold many photos. The admin picks one of the
// uploaded images as the thumbnail shown on the public gallery grid; the
// rest appear inside that event's lightbox/gallery view.
const galleryImageItemSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    caption: { type: String, default: '' },
  },
  { _id: true }
);

const galleryEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'Campus' },
    date: { type: Date, default: Date.now },
    images: {
      type: [galleryImageItemSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'At least one image is required',
      },
    },
    // Index into `images` (or the image's _id) used as the cover/thumbnail.
    thumbnailId: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Convenience virtual so the client can always read `thumbnailUrl` directly.
galleryEventSchema.virtual('thumbnailUrl').get(function () {
  if (!this.images || this.images.length === 0) return '';
  const match = this.images.find((img) => String(img._id) === String(this.thumbnailId));
  return (match || this.images[0]).url;
});

galleryEventSchema.set('toJSON', { virtuals: true });
galleryEventSchema.set('toObject', { virtuals: true });

export default mongoose.model('GalleryEvent', galleryEventSchema);
