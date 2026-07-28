import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { getTestimonials } from '../api/client';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    getTestimonials().then((data) => setTestimonials(data || []));
  }, []);

  if (!testimonials.length) return null;

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="font-mono text-xs tracking-[0.2em] text-[#D9383A] uppercase mb-2 font-semibold">
          Voices
        </p>
        <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white">
          Alumni Success Stories
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm">
          Hear what our graduates have to say about their journey and experiences with us.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <figure
            key={t._id || t.id}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex flex-col hover:border-b-2 hover:border-b-[#D9383A] transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <Quote className="text-[#D9383A]" size={28} />
            
            <blockquote className="text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed flex-1 italic">
              "{t.quote}"
            </blockquote>
            
            <figcaption className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-display text-sm font-bold text-[#1E3A8A] dark:text-blue-400">
                  {t.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  {t.role}
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}