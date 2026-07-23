import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ArrowUpRight } from 'lucide-react';
import { getNotices, getEvents } from '../api/client';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function NewsEvents() {
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getNotices().then((data) => setNotices(data.slice(0, 4)));
    getEvents().then((data) => setEvents(data.slice(0, 4)));
  }, []);

  return (
    <section className="bg-navy-50 dark:bg-navy-800/40 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="font-mono text-xs tracking-[0.2em] text-teal-600 dark:text-teal-400 uppercase mb-2">
          02 — Campus Life
        </p>
        <h2 className="font-display text-2xl sm:text-3xl font-medium text-navy dark:text-paper mb-8">
          Latest News &amp; Events
        </h2>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {notices.map((n) => (
              <Link
                key={n._id || n.id}
                to="/notices"
                className="group bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700 rounded-xl p-5 hover:border-marigold-300 hover:shadow-md transition-all"
              >
                <span className="inline-block text-[11px] font-mono uppercase tracking-wide text-marigold-600 dark:text-marigold-300 bg-marigold-50 dark:bg-marigold-500/10 px-2 py-0.5 rounded-full">
                  {n.category}
                </span>
                <h3 className="font-medium text-navy dark:text-paper mt-3 text-sm leading-snug group-hover:text-marigold-600 transition-colors">
                  {n.title}
                </h3>
                <p className="text-xs text-navy-400 dark:text-navy-300 mt-2 font-mono">{formatDate(n.date)}</p>
              </Link>
            ))}
          </div>

          <div className="bg-navy-900 text-paper rounded-xl p-6">
            <div className="flex items-center gap-2 mb-5 text-marigold-300">
              <CalendarDays size={17} />
              <h3 className="font-medium text-sm">Upcoming Events</h3>
            </div>
            <ul className="space-y-4">
              {events.map((e) => (
                <li key={e._id || e.id} className="flex justify-between gap-3 pb-4 border-b border-navy-700 last:border-0 last:pb-0">
                  <span className="text-sm text-navy-100">{e.title}</span>
                  <span className="font-mono text-xs text-navy-400 shrink-0">{formatDate(e.date)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Link to="/notices" className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-navy-600 dark:text-navy-100 hover:text-marigold-600">
          View full Notice Board <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  );
}
