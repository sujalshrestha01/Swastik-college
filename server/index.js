import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRouter from './routes/auth.js';
import settingsRouter from './routes/settings.js';
import noticesRouter from './routes/notices.js';
import coursesRouter from './routes/courses.js';
import contactRouter from './routes/contact.js';
import facultyRouter from './routes/faculty.js';
import eventsRouter from './routes/events.js';
import testimonialsRouter from './routes/testimonials.js';
import galleryRouter from './routes/gallery.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'swastik-college-api' });
});

app.use('/api/auth', authRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/notices', noticesRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/contact', contactRouter);
app.use('/api/faculty', facultyRouter);
app.use('/api/events', eventsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/gallery', galleryRouter);

// 404 handler for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Swastik College API running on http://localhost:${PORT}`);
  });
});
