import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';
import { getEvents } from '../api/client';

function getTimeLeft(target) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function EventCountdown() {
  const [event, setEvent] = useState(null);
  const [left, setLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    getEvents().then((events) => {
      const upcoming = events
        .filter((e) => new Date(e.date).getTime() > Date.now())
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      const featured = upcoming.find((e) => e.isFeatured) || upcoming[0];
      setEvent(featured || null);
    });
  }, []);

  useEffect(() => {
    if (!event) return;
    setLeft(getTimeLeft(event.date));
    const id = setInterval(() => setLeft(getTimeLeft(event.date)), 1000);
    return () => clearInterval(id);
  }, [event]);

  if (!event) return null;

  const units = [
    { label: 'Days', value: left.days },
    { label: 'Hrs', value: left.hours },
    { label: 'Min', value: left.minutes },
    { label: 'Sec', value: left.seconds },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      <div className="bg-teal-600 rounded-2xl px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-paper">
        <div className="flex items-center gap-3">
          <Timer size={22} className="text-marigold-200" />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-teal-100">Counting down to</p>
            <p className="font-display text-lg sm:text-xl font-medium">{event.title}</p>
          </div>
        </div>
        <div className="flex gap-3 sm:gap-4">
          {units.map((u) => (
            <div key={u.label} className="bg-teal-700/60 rounded-lg px-3.5 py-2 text-center min-w-[58px]">
              <p className="font-mono text-xl sm:text-2xl font-semibold tabular-nums">
                {String(u.value).padStart(2, '0')}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-teal-100">{u.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
