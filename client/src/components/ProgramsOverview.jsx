import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { getCourses } from '../api/client';

export default function ProgramsOverview() {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    getCourses().then(setPrograms);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-teal-600 dark:text-teal-400 uppercase mb-2">
            01 — Academics
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-navy dark:text-paper">
            Academic Programs
          </h2>
        </div>
        <Link to="/programs" className="hidden sm:flex items-center gap-1 text-sm font-medium text-navy-600 dark:text-navy-100 hover:text-marigold-600">
          View all <ArrowUpRight size={15} />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {programs.map((p) => (
          <Link
            key={p.slug}
            to={`/programs/${p.slug}`}
            className="group border border-navy-100 dark:border-navy-700 rounded-xl p-6 hover:border-marigold-300 hover:shadow-md transition-all bg-white dark:bg-navy-800"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-display text-xl font-medium text-navy dark:text-paper">{p.name}</h3>
              <ArrowUpRight size={16} className="text-navy-300 group-hover:text-marigold-500 transition-colors shrink-0" />
            </div>
            <p className="text-sm text-teal-600 dark:text-teal-400 font-medium mt-1">{p.tagline}</p>
            <p className="text-sm text-navy-400 dark:text-navy-200 mt-3 leading-relaxed">{p.description}</p>
            <div className="mt-4 pt-4 border-t border-navy-100 dark:border-navy-700 flex justify-between text-xs font-mono text-navy-400 dark:text-navy-300">
              <span>{p.duration}</span>
              <span>{p.seats} seats</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
