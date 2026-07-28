import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRouter from './routes/auth.js';
import settingsRouter from './routes/settings.js';
import noticesRouter from './routes/notices.js';
import downloadsRouter from './routes/downloads.js';
import blogRouter from './routes/blog.js';
import coursesRouter from './routes/courses.js';
import contactRouter from './routes/contact.js';
import facultyRouter from './routes/faculty.js';
import eventsRouter from './routes/events.js';
import testimonialsRouter from './routes/testimonials.js';
import galleryRouter from './routes/gallery.js';
import uploadRouter from './routes/upload.js';
import skillCoursesRouter from './routes/skillCourses.js';
import workshopsRouter from './routes/workshops.js';
import faqRouter from './routes/faq.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Serve locally uploaded images (faculty photos, hero images, gallery photos, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'swastik-college-api' });
});

app.use('/api/auth', authRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/notices', noticesRouter);
app.use('/api/downloads', downloadsRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/contact', contactRouter);
app.use('/api/faculty', facultyRouter);
app.use('/api/events', eventsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/skill-courses', skillCoursesRouter);
app.use('/api/workshops', workshopsRouter);
app.use('/api/faqs', faqRouter);

// 404 handler for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Central error handler (also catches multer errors, e.g. file too large / wrong type)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong' });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Swastik College API running on http://localhost:${PORT}`);
  });
});
