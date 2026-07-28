// models/Blog.js
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    category: {
      type: String,
      default: 'General',
    },
    author: {
      type: String,
      default: 'Department of Computer Science',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Blog', blogSchema);