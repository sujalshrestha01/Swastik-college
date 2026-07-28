import React, { useEffect, useState } from 'react';
import { Calendar, Tag, Eye, X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { getGalleryEvents, resolveImageUrl } from '../api/client';
import { Section } from '../components/Visibility';

const CATEGORIES = ['All', 'Events', 'Academics', 'Sports', 'Campus'];


export default function Gallery() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // State for active lightbox modal & active image carousel index
  const [activeEvent, setActiveEvent] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    getGalleryEvents().then((data) => {
      setEvents(data || []);
      setLoading(false);
    });
  }, []);

  const filteredEvents =
    selectedCategory === 'All' ? events : events.filter((item) => item.category === selectedCategory);

  const thumbnailIndexOf = (event) => {
    const idx = event.images?.findIndex((img) => String(img._id) === String(event.thumbnailId));
    return idx && idx > -1 ? idx : 0;
  };

  const openLightbox = (event) => {
    setActiveEvent(event);
    setCurrentImageIndex(thumbnailIndexOf(event));
  };

  const closeLightbox = () => {
    setActiveEvent(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (!activeEvent) return;
    setCurrentImageIndex((prev) => (prev + 1) % activeEvent.images.length);
  };

  const prevImage = () => {
    if (!activeEvent) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? activeEvent.images.length - 1 : prev - 1
    );
  };

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <Section page="gallery" section="hero">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-mono text-xs tracking-[0.2em] text-[#D9383A] font-semibold uppercase">
            Campus Life &amp; Events
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2">
            College Photo Gallery
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Explore photo albums from our academic activities, events, and student achievements.
          </p>
        </div>
        </Section>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                selectedCategory === category
                  ? 'bg-[#1E3A8A] text-white shadow-md scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-[#D9383A] border border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <Section page="gallery" section="grid">
        {loading ? (
          <p className="text-center text-sm text-slate-400 py-12">Loading gallery…</p>
        ) : filteredEvents.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-12">No photos here yet — check back soon.</p>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const coverImage = event.images[thumbnailIndexOf(event)] || event.images[0];
            return (
              <div
                key={event._id}
                onClick={() => openLightbox(event)}
                className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-b-2 hover:border-b-[#D9383A] transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                {/* Thumbnail Cover Image Box */}
                <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={resolveImageUrl(coverImage.url)}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Photo Count Pill */}
                  <div className="absolute top-3 right-3 bg-slate-950/70 backdrop-blur-md text-white font-mono text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                    <Images size={13} />
                    <span>{event.images.length} Photos</span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-full shadow-md">
                      <Eye size={14} /> View Album
                    </span>
                  </div>
                </div>

                {/* Card Info Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-mono">
                    <span className="inline-flex items-center gap-1 text-[#D9383A] font-medium">
                      <Tag size={12} /> {event.category}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} /> {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-[#1E3A8A] dark:text-blue-400 group-hover:text-[#D9383A] transition-colors line-clamp-1">
                    {event.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        )}
        </Section>

        {/* Multi-Image Album Lightbox Modal */}
        {activeEvent && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              
              {/* Modal Header Bar */}
              <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                <div>
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">
                    <span className="bg-red-50 dark:bg-red-950/50 text-[#D9383A] px-2.5 py-0.5 rounded-md font-semibold">
                      {activeEvent.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {new Date(activeEvent.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1E3A8A] dark:text-blue-400">
                    {activeEvent.title}
                  </h3>
                </div>

                {/* Close Button */}
                <button
                  onClick={closeLightbox}
                  className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-[#D9383A] hover:text-white text-slate-700 dark:text-slate-200 rounded-full transition-colors cursor-pointer shrink-0 ml-4"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Main Carousel Viewer */}
              <div className="relative bg-slate-950 aspect-video flex items-center justify-center overflow-hidden group">
                <img
                  src={resolveImageUrl(activeEvent.images[currentImageIndex]?.url)}
                  alt={activeEvent.images[currentImageIndex]?.caption || activeEvent.title}
                  className="w-full h-full object-contain"
                />

                {/* Previous / Next Arrows */}
                {activeEvent.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 p-2.5 rounded-full bg-slate-900/60 hover:bg-[#D9383A] text-white transition-colors cursor-pointer shadow-lg backdrop-blur-xs"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 p-2.5 rounded-full bg-slate-900/60 hover:bg-[#D9383A] text-white transition-colors cursor-pointer shadow-lg backdrop-blur-xs"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Image Counter & Caption Overlay */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-200 bg-slate-950/70 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 font-mono">
                  <span className="truncate pr-4">
                    {activeEvent.images[currentImageIndex]?.caption || activeEvent.description}
                  </span>
                  <span className="shrink-0 text-[#D9383A] font-bold">
                    {currentImageIndex + 1} / {activeEvent.images.length}
                  </span>
                </div>
              </div>

              {/* Thumbnail Strip (Bottom Selection) */}
              {activeEvent.images.length > 1 && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 overflow-x-auto">
                  {activeEvent.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        currentImageIndex === idx
                          ? 'border-[#D9383A] scale-105 shadow-md'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={resolveImageUrl(img.url)}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Description Body */}
              <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeEvent.description}
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}