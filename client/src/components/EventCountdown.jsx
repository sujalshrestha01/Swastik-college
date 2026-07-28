import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { getEvents } from "../api/client";

function getTimeLeft(target) {
  const targetTime = new Date(target).getTime();
  const diff = Math.max(0, targetTime - Date.now());
  return {
    diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function EventCountdown() {
  const [event, setEvent] = useState(null);
  const [left, setLeft] = useState({
    diff: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const loadEvent = async () => {
    try {
      const events = await getEvents();
      const now = Date.now();

      // Filter events where the event date is strictly in the future
      const upcoming = events
        .filter((e) => new Date(e.date).getTime() > now)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      const featured = upcoming.find(
        (e) => e.isFeatured === true || e.isFeatured === "true",
      );

      setEvent(featured || null);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  useEffect(() => {
    loadEvent();
  }, []);

  useEffect(() => {
    if (!event) return;

    const updateTimer = () => {
      const remaining = getTimeLeft(event.date);
      setLeft(remaining);

      // When countdown reaches 0, re-fetch. If no future events exist, loadEvent sets event to null and hides the component.
      if (remaining.diff <= 0) {
        loadEvent();
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, [event]);

  // Completely unmount/hide when no upcoming event exists or when the timer hits 0
  if (!event) return null;

  const units = [
    { label: "Days", value: left.days },
    { label: "Hrs", value: left.hours },
    { label: "Min", value: left.minutes },
    { label: "Sec", value: left.seconds },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      <div className="bg-teal-600 rounded-2xl px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-paper">
        <div className="flex items-center gap-3">
          <Timer size={22} className="text-marigold-200" />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-teal-100">
              Counting down to
            </p>
            <p className="font-display text-lg sm:text-xl font-medium">
              {event.title}
            </p>
          </div>
        </div>
        <div className="flex gap-3 sm:gap-4">
          {units.map((u) => (
            <div
              key={u.label}
              className="bg-teal-700/60 rounded-lg px-3.5 py-2 text-center min-w-[58px]"
            >
              <p className="font-mono text-xl sm:text-2xl font-semibold tabular-nums">
                {String(u.value).padStart(2, "0")}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-teal-100">
                {u.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
