import { useEffect, useRef, useState } from "react";
import { useSettings } from "../context/SettingsContext";

function useCountUp(target, active) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frame;
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);

  return value;
}

function Metric({ label, value, suffix }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const count = useCountUp(value, active);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center sm:text-left">
      <p className="font-mono text-3xl sm:text-4xl font-semibold text-navy dark:text-marigold-200">
        {count.toLocaleString()}
        {suffix || ""}
      </p>
      <p className="text-xs sm:text-sm text-navy-400 dark:text-navy-200 mt-1">
        {label}
      </p>
    </div>
  );
}

export default function MetricsCounter() {
  const { settings } = useSettings();
  const stats = settings.stats?.length ? settings.stats : [];

  if (!stats.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-y border-navy-100 dark:border-navy-700 py-10">
        {stats.map((m) => (
          <Metric key={m.label} {...m} />
        ))}
      </div>
    </section>
  );
}
