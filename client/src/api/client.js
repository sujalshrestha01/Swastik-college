import {
  notices as mockNotices,
  programs as mockPrograms,
  testimonials as mockTestimonials,
  newsEvents as mockEvents,
} from '../data/mockData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Root of the API server (without /api) — used to resolve uploaded image paths like /uploads/xyz.jpg
export const SERVER_ORIGIN = BASE_URL.replace(/\/api\/?$/, '');

const TOKEN_KEY = 'swastik_admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Resolves a stored image path (e.g. "/uploads/abc.jpg") into a full URL the
// browser can load. Absolute URLs (http://, https://) pass through unchanged.
export function resolveImageUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path;
  return `${SERVER_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}

async function safeFetch(path, fallback, options) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, options);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || `Request failed: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[api] falling back to demo data for ${path}:`, err.message);
    return fallback;
  }
}

// Like safeFetch, but for admin calls where a failure must surface (no silent fallback).
async function apiCall(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || `Request failed: ${res.status}`);
  }
  return body;
}

// ---------- Public reads (fall back to demo data if API is offline) ----------
export function getNotices(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return safeFetch(`/notices${qs ? `?${qs}` : ''}`, mockNotices);
}
export function getDownloads() {
  return safeFetch('/downloads', []);
}
export function getCourses(opts = {}) {
  const qs = opts.all ? '?all=true' : '';
  return safeFetch(`/courses${qs}`, mockPrograms);
}
export function getCourse(slug) {
  return safeFetch(`/courses/${slug}`, mockPrograms.find((p) => p.slug === slug) || null);
}
export function getSettings() {
  return safeFetch('/settings', null);
}
export function getFaculty() {
  return safeFetch('/faculty', []);
}
export function getEvents() {
  return safeFetch('/events', mockEvents);
}
export function getTestimonials() {
  return safeFetch('/testimonials', mockTestimonials);
}
// Gallery events — each event can hold multiple images + a chosen thumbnail.
export function getGalleryEvents() {
  return safeFetch('/gallery', []);
}
export function getGalleryEvent(id) {
  return safeFetch(`/gallery/${id}`, null);
}
export function submitContactForm(payload) {
  return safeFetch('/contact', { ok: true, demo: true }, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

// ---------- Auth ----------
export function login(email, password) {
  return apiCall('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}
export function fetchMe() {
  return apiCall('/auth/me');
}
export function changePassword(currentPassword, newPassword) {
  return apiCall('/auth/password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) });
}
export function inviteAdmin({ name, email, role }) {
  return apiCall('/auth/invite', { method: 'POST', body: JSON.stringify({ name, email, role }) });
}
export function acceptInvite(token, password) {
  return apiCall('/auth/accept-invite', { method: 'POST', body: JSON.stringify({ token, password }) });
}

// ---------- Admin: Settings ----------
export function updateSettings(payload) {
  return apiCall('/settings', { method: 'PUT', body: JSON.stringify(payload) });
}

// ---------- Admin: Page & Section Visibility ----------
export function getVisibilitySchema() {
  return apiCall('/settings/visibility-schema');
}
export function updateVisibility(visibility) {
  return apiCall('/settings/visibility', { method: 'PUT', body: JSON.stringify({ visibility }) });
}

// ---------- Admin: image upload (from the admin's own device) ----------
// Returns { url, filename, size }
export function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  return apiCall('/upload', { method: 'POST', body: formData });
}
// Returns { files: [{ url, filename, size }] }
export function uploadImages(files) {
  const formData = new FormData();
  Array.from(files).forEach((f) => formData.append('images', f));
  return apiCall('/upload/multiple', { method: 'POST', body: formData });
}

// ---------- Admin: generic CRUD helper for simple resources ----------
function makeCrud(resource) {
  return {
    list: () => apiCall(`/${resource}`),
    create: (payload) => apiCall(`/${resource}`, { method: 'POST', body: JSON.stringify(payload) }),
    update: (id, payload) => apiCall(`/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    remove: (id) => apiCall(`/${resource}/${id}`, { method: 'DELETE' }),
  };
}

export const noticesAdmin = makeCrud('notices');
export const downloadsAdmin = makeCrud('downloads');
export const facultyAdmin = makeCrud('faculty');
export const eventsAdmin = makeCrud('events');
export const testimonialsAdmin = makeCrud('testimonials');
export const galleryAdmin = makeCrud('gallery');

export const coursesAdmin = {
  list: () => apiCall('/courses?all=true'),
  create: (payload) => apiCall('/courses', { method: 'POST', body: JSON.stringify(payload) }),
  update: (slug, payload) => apiCall(`/courses/${slug}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (slug) => apiCall(`/courses/${slug}`, { method: 'DELETE' }),
};

export const messagesAdmin = {
  list: () => apiCall('/contact'),
  markRead: (id) => apiCall(`/contact/${id}/read`, { method: 'PATCH' }),
  remove: (id) => apiCall(`/contact/${id}`, { method: 'DELETE' }),
};

// ---------- Non-credit skill courses (informational cards) ----------
export function getSkillCourses() {
  return safeFetch('/skill-courses', []);
}
export const skillCoursesAdmin = makeCrud('skill-courses');

// ---------- Live workshops (enrollable, link out to an admin-set form) ----------
export function getWorkshops() {
  return safeFetch('/workshops', []);
}
export const workshopsAdmin = {
  list: () => apiCall('/workshops?all=true'),
  create: (payload) => apiCall('/workshops', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => apiCall(`/workshops/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id) => apiCall(`/workshops/${id}`, { method: 'DELETE' }),
};

// ---------- FAQs (powers the "Chat with Admissions" instant-answer widget) ----------
export function getFaqs() {
  return safeFetch('/faqs', []);
}
export const faqsAdmin = makeCrud('faqs');

// ---------- Blog (public + admin) ----------
export function getBlogs(opts = {}) {
  const qs = opts.all ? '?all=true' : '';
  return safeFetch(`/blogs${qs}`, []);
}
export function getBlog(identifier) {
  return safeFetch(`/blogs/${identifier}`, null);
}
export const blogAdmin = {
  list: () => apiCall('/blogs?all=true'),
  create: (payload) => apiCall('/blogs', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => apiCall(`/blogs/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id) => apiCall(`/blogs/${id}`, { method: 'DELETE' }),
};
