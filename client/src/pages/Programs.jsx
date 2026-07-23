import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { getCourses } from '../api/client';

export default function Programs() {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    getCourses().then(setPrograms);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <p className="font-mono text-xs tracking-[0.2em] text-teal-600 dark:text-teal-400 uppercase mb-2">
        Academics
      </p>
      <h1 className="font-display text-3xl sm:text-4xl font-medium text-navy dark:text-paper mb-3">
        Academic Programs
      </h1>
      <p className="text-navy-400 dark:text-navy-200 max-w-2xl mb-10">
        Three TU-affiliated programs, each with semester-wise curriculum and
        downloadable syllabus.
      </p>

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
    </div>
  );
}
