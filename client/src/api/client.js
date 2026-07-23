import {
  notices as mockNotices,
  programs as mockPrograms,
  testimonials as mockTestimonials,
  newsEvents as mockEvents,
} from '../data/mockData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
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
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
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
export function getGallery() {
  return safeFetch('/gallery', []);
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

// ---------- Admin: Settings ----------
export function updateSettings(payload) {
  return apiCall('/settings', { method: 'PUT', body: JSON.stringify(payload) });
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
