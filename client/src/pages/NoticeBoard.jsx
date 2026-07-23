import { useEffect, useMemo, useState } from 'react';
import { Search, Download, Bell } from 'lucide-react';
import { getNotices } from '../api/client';

const CATEGORIES = ['All', 'Exams', 'Admissions', 'Events', 'General'];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    getNotices().then(setNotices);
  }, []);

  const filtered = useMemo(() => {
    return notices
      .filter((n) => (category === 'All' ? true : n.category === category))
      .filter((n) =>
        query.trim() === ''
          ? true
          : (n.title + ' ' + n.excerpt).toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [notices, query, category]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <div className="flex items-center gap-2 mb-2 text-teal-600 dark:text-teal-400">
        <Bell size={16} />
        <p className="font-mono text-xs tracking-[0.2em] uppercase">Notice Board</p>
      </div>
      <h1 className="font-display text-3xl sm:text-4xl font-medium text-navy dark:text-paper mb-6">
        All Notices
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search notices…"
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-navy-100 dark:border-navy-700 bg-white dark:bg-navy-800 text-sm text-navy dark:text-paper placeholder:text-navy-300 focus:border-marigold-300 outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium border transition-colors ${
                category === c
                  ? 'bg-navy text-paper border-navy dark:bg-marigold dark:text-navy-900 dark:border-marigold'
                  : 'border-navy-100 dark:border-navy-700 text-navy-500 dark:text-navy-200 hover:border-marigold-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-navy-400 mb-4 font-mono">
        {filtered.length} notice{filtered.length !== 1 ? 's' : ''} found
      </p>

      <div className="space-y-3">
        {filtered.map((n) => (
          <div
            key={n.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-navy-100 dark:border-navy-700 rounded-xl p-5 bg-white dark:bg-navy-800 hover:border-marigold-300 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[11px] font-mono uppercase tracking-wide text-marigold-600 dark:text-marigold-300 bg-marigold-50 dark:bg-marigold-500/10 px-2 py-0.5 rounded-full">
                  {n.category}
                </span>
                <span className="text-xs text-navy-400 font-mono">{formatDate(n.date)}</span>
              </div>
              <h3 className="font-medium text-navy dark:text-paper text-sm">{n.title}</h3>
              <p className="text-xs text-navy-400 dark:text-navy-300 mt-1.5">{n.excerpt}</p>
            </div>
            <a
              href={n.fileUrl}
              download
              className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-navy-600 dark:text-navy-100 border border-navy-100 dark:border-navy-700 px-3.5 py-2 rounded-full hover:border-marigold-300 hover:text-marigold-600 transition-colors"
            >
              <Download size={14} /> Download
            </a>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-navy-400 py-16 text-sm">No notices match your search.</p>
        )}
      </div>
    </div>
  );
}
