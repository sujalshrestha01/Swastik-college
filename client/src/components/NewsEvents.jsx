import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ArrowUpRight } from 'lucide-react';
import { getNotices, getEvents } from '../api/client';
import { useSettings } from '../context/SettingsContext';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function NewsEvents() {
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const { isPageEnabled } = useSettings();
  const noticesEnabled = isPageEnabled('notices');

  useEffect(() => {
    if (noticesEnabled) getNotices().then((data) => setNotices(data.slice(0, 4)));
    getEvents().then((data) => setEvents(data.slice(0, 4)));
  }, [noticesEnabled]);

  return (
    <section className="bg-slate-50 dark:bg-navy-900/90 py-16 sm:py-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Latest News &amp; Events
          </h2>
        </div>

        {/* Content Layout Grid */}
        <div className={`grid gap-8 ${noticesEnabled ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
          
          {/* Left: Notices Cards Grid — hidden entirely if the Notice Board page is disabled */}
          {noticesEnabled && (
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              {notices.map((n) => (
                <Link
                  key={n._id || n.id}
                  to="/notices"
                  className="group bg-white dark:bg-navy-800/80 rounded-r-2xl rounded-l-md p-5 border-l-4 border-l-transparent hover:border-l-[#D9383A] dark:hover:border-l-[#3B82F6] shadow-xs hover:shadow-md dark:shadow-navy-950/50 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <span className="inline-block text-[11px] font-mono uppercase tracking-wide text-[#D9383A] dark:text-[#3B82F6] font-semibold bg-red-50 dark:bg-blue-950/50 border border-red-100 dark:border-blue-900/40 px-2.5 py-0.5 rounded-full">
                      {n.category}
                    </span>
                    <h3 className="font-semibold text-slate-900 dark:text-white mt-3 text-sm leading-snug group-hover:text-[#D9383A] dark:group-hover:text-[#3B82F6] transition-colors">
                      {n.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-navy-100/70 mt-4 font-mono">
                    {formatDate(n.date)}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {/* Right: Upcoming Events Panel */}
          <div className="bg-[#0F172A] dark:bg-navy-950 text-white rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6 text-white">
                <CalendarDays size={18} className="text-[#D9383A] dark:text-[#3B82F6]" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-white">Upcoming Events</h3>
              </div>
              <ul className="space-y-4">
                {events.map((e) => (
                  <li key={e._id || e.id} className="flex justify-between items-start gap-3 pb-4 border-b border-slate-800 dark:border-navy-800 last:border-0 last:pb-0">
                    <span className="text-sm font-medium text-slate-200 dark:text-navy-100 leading-snug">{e.title}</span>
                    <span className="font-mono text-xs text-slate-400 dark:text-navy-100/70 shrink-0 bg-slate-800 dark:bg-navy-800 px-2 py-0.5 rounded border border-slate-700/60 dark:border-navy-700">
                      {formatDate(e.date)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* View Full Notice Board Link — only when the page is reachable */}
        {noticesEnabled && (
          <Link 
            to="/notices" 
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-navy-100 hover:text-[#D9383A] dark:hover:text-[#3B82F6] transition-colors group"
          >
            <span>View full Notice Board</span>
            <ArrowUpRight size={16} className="text-slate-400 dark:text-navy-100/70 group-hover:text-[#D9383A] dark:group-hover:text-[#3B82F6] transition-colors" />
          </Link>
        )}
      </div>
    </section>
  );
}