import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { getTestimonials } from '../api/client';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    getTestimonials().then(setTestimonials);
  }, []);

  if (!testimonials.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <p className="font-mono text-xs tracking-[0.2em] text-teal-600 dark:text-teal-400 uppercase mb-2">
        03 — Voices
      </p>
      <h2 className="font-display text-2xl sm:text-3xl font-medium text-navy dark:text-paper mb-8">
        Alumni Success Stories
      </h2>

      <div className="grid sm:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <figure
            key={t._id || t.id}
            className="bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700 rounded-xl p-6 flex flex-col"
          >
            <Quote className="text-marigold-300" size={22} />
            <blockquote className="text-sm text-navy-600 dark:text-navy-100 mt-4 leading-relaxed flex-1">
              "{t.quote}"
            </blockquote>
            <figcaption className="mt-5 pt-4 border-t border-navy-100 dark:border-navy-700">
              <p className="text-sm font-semibold text-navy dark:text-paper">{t.name}</p>
              <p className="text-xs text-navy-400 dark:text-navy-300 font-mono">{t.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
