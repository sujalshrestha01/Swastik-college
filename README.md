# Swastik College — Full Website + Admin CMS

A complete MERN-stack college website with a full-featured admin panel that
controls every editable detail of the site.

## What's included

**Public site**
- Home, Academic Programs (with per-course detail pages), Notice Board,
  About, Faculty, Contact/Admission Inquiry form
- Dynamic homepage hero, quick stats, testimonials, upcoming-event countdown,
  and an announcement bar — all editable from the admin panel
- Dark mode, mobile-responsive, fast Vite build

**Admin panel** (`/admin`)
- Secure login (JWT-based sessions)
- **Courses & Subjects** — add/remove programs (BSc. CSIT, BCA, BBS, or any
  new one), and edit every semester's subject list, subject codes and
  credit hours
- **Notice Board** — publish/edit/delete notices by category
- **Faculty** — manage staff profiles
- **Events** — manage upcoming events, mark one as "featured" for the
  homepage countdown
- **Testimonials** — manage alumni quotes shown on the homepage
- **Gallery** — manage campus photos
- **Inquiries** — view and manage messages submitted through the Contact
  form
- **Site Settings** — the "everything else" panel: college name, tagline,
  established year, affiliation, homepage hero text, about/mission/vision,
  address, phone, email, office hours, **Facebook/Instagram/YouTube/
  LinkedIn/Twitter links**, homepage stats counters, footer note, and the
  announcement bar text/toggle

## Project structure

```
swastik-college-mern/
├── server/     Express + MongoDB API (JWT auth, full CRUD)
└── client/     React + Vite + Tailwind frontend (public site + admin panel)
```

## Getting started

### 1. Backend

```bash
cd server
cp .env.example .env      # edit MONGO_URI, JWT_SECRET, admin credentials
npm install
npm run seed               # creates sample data + your first admin login
npm run dev                # starts the API on http://localhost:5000
```

Your admin login is whatever you set as `ADMIN_EMAIL` / `ADMIN_PASSWORD` in
`.env` before running `npm run seed` (defaults to
`admin@swastikcollege.edu.np` / `ChangeMe123!` if left unset — **change
this**).

### 2. Frontend

```bash
cd client
npm install
npm run dev                 # starts the site on http://localhost:5173
```

Visit `http://localhost:5173/admin/login` to sign in to the admin panel.

If your API runs somewhere other than `http://localhost:5000/api`, set
`VITE_API_URL` in a `client/.env` file.

### 3. Production build

```bash
cd client && npm run build   # outputs static files to client/dist
cd server && npm start       # run the API with a process manager (pm2, etc.)
```

Serve `client/dist` from any static host or from the same Express server
using `express.static`, and point it at your production `MONGO_URI`.

## Notes

- The public site gracefully falls back to bundled demo content if the API
  is unreachable, so the frontend can be previewed/designed even without
  MongoDB running. Once the API is live, all content comes from the
  database and is editable through `/admin`.
- Change `JWT_SECRET` and the seeded admin password before deploying.
